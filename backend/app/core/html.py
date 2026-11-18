"""HTML sanitising for admin-authored rich content (project case studies).

Project content is rendered on the public site with dangerouslySetInnerHTML,
so anything stored must be stripped of scripts, event handlers and unsafe URLs.
"""
import nh3

_TAGS = {
    "p", "br", "hr", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em", "i", "u", "s",
    "blockquote", "code", "pre", "ul", "ol", "li", "a", "img", "figure", "figcaption",
    "table", "thead", "tbody", "tr", "th", "td", "span", "div", "sub", "sup",
}
_ATTRS = {
    "a": {"href", "title"},
    "img": {"src", "alt", "title", "width", "height"},
    "th": {"colspan", "rowspan"},
    "td": {"colspan", "rowspan"},
    "code": {"class"},
    "pre": {"class"},
}


def clean_html(value: str | None) -> str:
    if not value:
        return ""
    return nh3.clean(
        value,
        tags=_TAGS,
        attributes=_ATTRS,
        url_schemes={"https", "http", "mailto", "tel"},
        link_rel="noopener noreferrer",
    )
