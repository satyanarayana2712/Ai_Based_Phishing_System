import re
import math
import urllib.parse
from typing import Dict, Any, List, Tuple
from collections import Counter


SUSPICIOUS_KEYWORDS = [
    "login", "signin", "verify", "verification", "update", "secure", "security",
    "account", "banking", "authenticate", "confirm", "password", "credential",
    "wallet", "support", "billing", "service", "paypal", "appleid", "microsoft",
    "netflix", "amazon", "googledrive", "dropbox", "ebay", "crypto", "free",
    "bonus", "gift", "recover", "unlock", "alert", "validation"
]

SUSPICIOUS_TLDS = {
    "xyz", "top", "tk", "ml", "ga", "cf", "gq", "buzz", "club",
    "work", "click", "monster", "fit", "rest", "surf", "icu", "cam", "bid"
}

TOP_TRUSTED_DOMAINS = {
    "google.com", "youtube.com", "facebook.com", "wikipedia.org", "yahoo.com",
    "amazon.com", "reddit.com", "microsoft.com", "apple.com", "github.com",
    "linkedin.com", "twitter.com", "x.com", "instagram.com", "netflix.com",
    "stackoverflow.com", "cloudflare.com", "gov", "edu", "paypal.com"
}

SHORTENER_DOMAINS = {
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd",
    "buff.ly", "rebrand.ly", "cutt.ly", "shorte.st"
}

POPULAR_BRANDS = [
    "google", "paypal", "apple", "microsoft", "amazon", "netflix",
    "facebook", "instagram", "chase", "wellsfargo", "bankofamerica",
    "binance", "coinbase", "metamask", "whatsapp", "telegram", "steam"
]


def calculate_entropy(text: str) -> float:
    """Computes Shannon entropy of a string."""
    if not text:
        return 0.0
    counter = Counter(text)
    length = len(text)
    entropy = 0.0
    for count in counter.values():
        p = count / length
        entropy -= p * math.log2(p)
    return round(entropy, 4)


def is_ip_address(hostname: str) -> bool:
    """Checks if hostname is an IPv4 or IPv6 address."""
    # IPv4 regex
    ipv4_pattern = re.compile(r"^(\d{1,3}\.){3}\d{1,3}$")
    if ipv4_pattern.match(hostname):
        parts = hostname.split(".")
        return all(0 <= int(part) <= 255 for part in parts)
    # Check hexadecimal / octal IP formats
    if re.match(r"^0x[0-9a-fA-F]+", hostname):
        return True
    return False


def normalize_url(raw_url: str) -> str:
    """Normalizes URL by stripping whitespace and adding scheme if missing."""
    url = raw_url.strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    return url


def extract_features(raw_url: str) -> Dict[str, Any]:
    """
    Extracts 30+ lexical, structural, and semantic features from a URL.
    Returns a dictionary of raw features and high-level signals.
    """
    norm_url = normalize_url(raw_url)
    parsed = urllib.parse.urlparse(norm_url)
    
    hostname = parsed.hostname or ""
    path = parsed.path or ""
    query = parsed.query or ""
    netloc = parsed.netloc or ""
    
    # Clean domain (without port)
    domain_clean = hostname.lower()
    url_lower = norm_url.lower()
    
    # Lengths
    url_length = len(norm_url)
    domain_length = len(domain_clean)
    path_length = len(path)
    query_length = len(query)
    
    # Character counts in full URL
    count_dots = norm_url.count(".")
    count_hyphens = norm_url.count("-")
    count_underscores = norm_url.count("_")
    count_slashes = norm_url.count("/")
    count_question = norm_url.count("?")
    count_equals = norm_url.count("=")
    count_at = norm_url.count("@")
    count_ampersand = norm_url.count("&")
    count_percent = norm_url.count("%")
    count_digits_url = sum(c.isdigit() for c in norm_url)
    digit_ratio_url = count_digits_url / max(url_length, 1)
    
    # Character counts in domain
    count_dots_domain = domain_clean.count(".")
    count_hyphens_domain = domain_clean.count("-")
    count_digits_domain = sum(c.isdigit() for c in domain_clean)
    digit_ratio_domain = count_digits_domain / max(domain_length, 1)
    
    # Subdomains calculation
    domain_parts = domain_clean.split(".")
    num_subdomains = max(0, len(domain_parts) - 2) if len(domain_parts) >= 2 else 0
    tld = domain_parts[-1] if len(domain_parts) > 1 else ""
    
    # Entropy
    domain_entropy = calculate_entropy(domain_clean)
    url_entropy = calculate_entropy(norm_url)
    
    # Structural features
    has_ip = 1 if is_ip_address(domain_clean) else 0
    is_https = 1 if parsed.scheme == "https" else 0
    has_port = 1 if parsed.port and parsed.port not in (80, 443) else 0
    is_punycode = 1 if "xn--" in domain_clean else 0
    is_shortener = 1 if domain_clean in SHORTENER_DOMAINS else 0
    double_slash_in_path = 1 if "//" in path else 0
    
    # NLP / Keyword indicators
    suspicious_keywords_found = [kw for kw in SUSPICIOUS_KEYWORDS if kw in url_lower]
    suspicious_token_count = len(suspicious_keywords_found)
    
    # Brand spoofing in subdomain check (e.g. paypal.security-check.com)
    root_domain = ".".join(domain_parts[-2:]) if len(domain_parts) >= 2 else domain_clean
    subdomain_str = ".".join(domain_parts[:-2]) if len(domain_parts) > 2 else ""
    
    brand_spoofed = 0
    brand_spoofed_name = ""
    for brand in POPULAR_BRANDS:
        if brand in subdomain_str and brand not in root_domain:
            brand_spoofed = 1
            brand_spoofed_name = brand
            break
            
    is_suspicious_tld = 1 if tld in SUSPICIOUS_TLDS else 0
    
    # Feature vector for ML models
    feature_dict = {
        "url_length": url_length,
        "domain_length": domain_length,
        "path_length": path_length,
        "query_length": query_length,
        "count_dots": count_dots,
        "count_hyphens": count_hyphens,
        "count_underscores": count_underscores,
        "count_slashes": count_slashes,
        "count_question": count_question,
        "count_equals": count_equals,
        "count_at": count_at,
        "count_ampersand": count_ampersand,
        "count_percent": count_percent,
        "count_digits_url": count_digits_url,
        "digit_ratio_url": round(digit_ratio_url, 4),
        "count_dots_domain": count_dots_domain,
        "count_hyphens_domain": count_hyphens_domain,
        "count_digits_domain": count_digits_domain,
        "digit_ratio_domain": round(digit_ratio_domain, 4),
        "num_subdomains": num_subdomains,
        "domain_entropy": domain_entropy,
        "url_entropy": url_entropy,
        "has_ip": has_ip,
        "is_https": is_https,
        "has_port": has_port,
        "is_punycode": is_punycode,
        "is_shortener": is_shortener,
        "double_slash_in_path": double_slash_in_path,
        "suspicious_token_count": suspicious_token_count,
        "brand_spoofed": brand_spoofed,
        "is_suspicious_tld": is_suspicious_tld
    }
    
    metadata = {
        "raw_url": raw_url,
        "normalized_url": norm_url,
        "hostname": domain_clean,
        "domain": root_domain,
        "tld": tld,
        "path": path,
        "suspicious_keywords": suspicious_keywords_found,
        "brand_spoofed_name": brand_spoofed_name,
        "is_known_trusted": any(root_domain.endswith(td) for td in TOP_TRUSTED_DOMAINS)
    }
    
    return {
        "vector": feature_dict,
        "metadata": metadata
    }


FEATURE_NAMES = [
    "url_length", "domain_length", "path_length", "query_length",
    "count_dots", "count_hyphens", "count_underscores", "count_slashes",
    "count_question", "count_equals", "count_at", "count_ampersand", "count_percent",
    "count_digits_url", "digit_ratio_url", "count_dots_domain", "count_hyphens_domain",
    "count_digits_domain", "digit_ratio_domain", "num_subdomains", "domain_entropy",
    "url_entropy", "has_ip", "is_https", "has_port", "is_punycode", "is_shortener",
    "double_slash_in_path", "suspicious_token_count", "brand_spoofed", "is_suspicious_tld"
]


def vector_to_list(feature_dict: Dict[str, Any]) -> List[float]:
    """Converts feature dictionary to an ordered feature list matching FEATURE_NAMES."""
    return [float(feature_dict.get(fn, 0.0)) for fn in FEATURE_NAMES]
