"""Tiny helper for the site's inline SVG diagrams.

Every shape uses the theme classes from src/styles/custom.css (dg-cell, dg-cell-a/b/c/dim,
dg-t-*, dg-line*, dg-head*), so diagrams follow light and dark mode automatically.
figure() returns one line of HTML that can be pasted straight into a Markdown lesson.
"""
import math
from html import escape

TEXT = {'': '', 'plain': '', 'dim': '', 'a': 'dg-t-a', 'b': 'dg-t-b', 'c': 'dg-t-c',
        'muted': 'dg-t-muted', 'strong': 'dg-t-strong'}


def _f(v):
    return f'{v:.1f}'.rstrip('0').rstrip('.') if isinstance(v, float) else str(v)


class D:
    def __init__(self, w, h, ident, title, min_width=None):
        self.w, self.h, self.id, self.title = w, h, ident, title
        self.min = min_width if min_width is not None else min(w, 460)
        self.back, self.front = [], []   # lines go behind shapes

    # ---- primitives ----
    def text(self, x, y, s, cls='', anchor='middle', size=None, layer='front'):
        c = TEXT.get(cls, cls)
        attrs = f' class="{c}"' if c else ''
        style = f' style="font-size:{size}px"' if size else ''
        a = '' if anchor == 'start' else f' text-anchor="{anchor}"'
        (self.front if layer == 'front' else self.back).append(
            f'<text{attrs} x="{_f(x)}" y="{_f(y)}"{a}{style}>{escape(str(s))}</text>')

    def rect(self, x, y, w, h, kind='', rx=5):
        cls = 'dg-cell' + (f'-{kind}' if kind and kind != 'plain' else '')
        self.front.append(f'<rect class="{cls}" x="{_f(x)}" y="{_f(y)}" width="{_f(w)}" height="{_f(h)}" rx="{rx}"/>')

    def cell(self, x, y, w, h, label, kind='', rx=5, size=None):
        self.rect(x, y, w, h, kind, rx)
        if label != '' and label is not None:
            self.text(x + w / 2, y + h / 2, label, kind, size=size)

    def circle(self, x, y, r, label, kind='', size=None):
        cls = 'dg-cell' + (f'-{kind}' if kind and kind != 'plain' else '')
        self.front.append(f'<circle class="{cls}" cx="{_f(x)}" cy="{_f(y)}" r="{r}"/>')
        if label != '' and label is not None:
            self.text(x, y, label, kind, size=size)

    def _marker(self, kind):
        return f'url(#ah-{self.id}{"-" + kind if kind else ""})'

    def line(self, x1, y1, x2, y2, kind='', arrow=False, dash=False):
        cls = 'dg-line' + (f'-{kind}' if kind else '')
        m = f' marker-end="{self._marker(kind)}"' if arrow else ''
        d = ' stroke-dasharray="5 4"' if dash else ''
        self.back.append(f'<line class="{cls}" x1="{_f(x1)}" y1="{_f(y1)}" x2="{_f(x2)}" y2="{_f(y2)}"{m}{d}/>')

    def path(self, d, kind='', arrow=False, dash=False):
        cls = 'dg-line' + (f'-{kind}' if kind else '')
        m = f' marker-end="{self._marker(kind)}"' if arrow else ''
        ds = ' stroke-dasharray="5 4"' if dash else ''
        self.back.append(f'<path class="{cls}" d="{d}"{m}{ds}/>')

    # ---- composites ----
    def row(self, x, y, values, kinds=None, cw=46, ch=40, gap=0, idx=None, idx_cls='muted', size=None):
        """A row of boxes; returns the centre x of each box."""
        kinds = kinds or [''] * len(values)
        xs = []
        for i, v in enumerate(values):
            cx = x + i * (cw + gap)
            self.cell(cx, y, cw, ch, v, kinds[i], rx=4, size=size)
            xs.append(cx + cw / 2)
            if idx is not None:
                self.text(cx + cw / 2, y + ch + 14, idx[i] if isinstance(idx, list) else idx + i, idx_cls)
        return xs

    def edge(self, p, q, r1=0, r2=0, kind='', arrow=False, label=None, label_cls='muted',
             dash=False, bend=0, label_off=12):
        """Line between two node centres, trimmed by the node radii."""
        (x1, y1), (x2, y2) = p, q
        dx, dy = x2 - x1, y2 - y1
        L = math.hypot(dx, dy) or 1
        ux, uy = dx / L, dy / L
        sx, sy = x1 + ux * r1, y1 + uy * r1
        ex, ey = x2 - ux * (r2 + (2 if arrow else 0)), y2 - uy * (r2 + (2 if arrow else 0))
        mx, my = (sx + ex) / 2, (sy + ey) / 2
        nx, ny = -uy, ux
        if bend:
            cx, cy = mx + nx * bend, my + ny * bend
            self.path(f'M{_f(sx)},{_f(sy)} Q{_f(cx)},{_f(cy)} {_f(ex)},{_f(ey)}', kind, arrow, dash)
            mx, my = (sx + 2 * cx + ex) / 4, (sy + 2 * cy + ey) / 4
        else:
            self.line(sx, sy, ex, ey, kind, arrow, dash)
        if label is not None:
            lx, ly = mx + nx * label_off, my + ny * label_off
            self.text(lx, ly, label, label_cls, layer='front')

    def graph(self, nodes, edges, r=18, directed=False, size=None):
        """nodes: {id: (x, y, label, kind)}; edges: (a, b, kind, label[, bend])."""
        for e in edges:
            a, b = e[0], e[1]
            kind = e[2] if len(e) > 2 else ''
            label = e[3] if len(e) > 3 else None
            bend = e[4] if len(e) > 4 else 0
            self.edge(nodes[a][:2], nodes[b][:2], r, r, kind, directed, label, bend=bend)
        for k, n in nodes.items():
            x, y, label = n[0], n[1], n[2]
            kind = n[3] if len(n) > 3 else ''
            self.circle(x, y, r, label, kind, size=size)

    def svg(self):
        defs = ''.join(
            f'<marker id="ah-{self.id}{"-" + k if k else ""}" viewBox="0 0 10 10" refX="9" refY="5" '
            f'markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
            f'<path class="dg-head{"-" + k if k else ""}" d="M0,0 L10,5 L0,10 z"/></marker>'
            for k in ('', 'a', 'b'))
        return (f'<svg style="--dg-min:{self.min}px" class="dg" viewBox="0 0 {self.w} {self.h}" role="img" '
                f'aria-labelledby="{self.id}-t"><title id="{self.id}-t">{escape(self.title)}</title>'
                f'<defs>{defs}</defs>{"".join(self.back)}{"".join(self.front)}</svg>')


def figure(d, caption, legend=None):
    leg = ''
    if legend:
        leg = '<ul class="dg-legend">' + ''.join(
            f'<li><span class="dg-swatch {k or "plain"}"></span>{escape(t)}</li>' for k, t in legend) + '</ul>'
    return f'<figure class="diagram">{d.svg()}{leg}<figcaption>{escape(caption)}</figcaption></figure>'


def N(v, k='', l=None, r=None, e='', kids=None, el=None):
    """A tree node for bintree(): value, kind, left, right, kind of the edge into it.
    Pass kids=[...] instead of l and r for a node with any number of children."""
    return {'v': v, 'k': k, 'l': l, 'r': r, 'e': e, 'kids': kids, 'el': el}


def bintree(d, t, x, y, spread, dy=62, r=18, size=None, sub_w=34):
    """Draw a tree top-down; children of a binary node sit at x ± spread, halving each level.
    Values starting with 'T' and kind 'sub' are drawn as subtree triangles."""
    if t is None:
        return
    kids = t['kids']
    if kids is None:
        kids = [(t['l'], x - spread), (t['r'], x + spread)]
    else:
        n = len(kids)
        kids = [(c, x + (i - (n - 1) / 2) * spread) for i, c in enumerate(kids)]
    for c, cx in kids:
        if c is None:
            continue
        cy = y + dy
        rc = 0 if c['k'] == 'sub' else r
        d.edge((x, y), (cx, cy - (14 if c['k'] == 'sub' else 0)), r, rc, c['e'], label=c.get('el'),
               label_cls=c['e'] or 'muted')
        bintree(d, c, cx, cy, spread / 2, dy, r, size, sub_w)
    if t['k'] == 'sub':
        h = 34
        d.path(f'M{x:.1f},{y - 14:.1f} L{x + sub_w / 2:.1f},{y - 14 + h:.1f} L{x - sub_w / 2:.1f},{y - 14 + h:.1f} Z')
        d.text(x, y + 8, t['v'], 'muted')
    elif t['k'] == 'box':
        w = max(40, 11 * len(str(t['v'])) + 16)
        d.cell(x - w / 2, y - 16, w, 32, t['v'], '', rx=4, size=size)
    elif t['k'].startswith('box-'):
        w = max(40, 11 * len(str(t['v'])) + 16)
        d.cell(x - w / 2, y - 16, w, 32, t['v'], t['k'][4:], rx=4, size=size)
    else:
        d.circle(x, y, r, t['v'], t['k'], size=size)


def tidytree(d, t, x0, y, gap=60, dy=66, r=18, size=None):
    """Like bintree, but leaves are spaced evenly left to right and each parent sits
    centred over its children, so deep, lopsided trees never overlap."""
    counter = [0]

    def place(n, depth):
        kids = [c for c in ([n['l'], n['r']] if n['kids'] is None else n['kids']) if c is not None]
        n['_kids'] = kids
        n['_y'] = y + depth * dy
        if not kids:
            n['_x'] = x0 + counter[0] * gap
            counter[0] += 1
        else:
            for c in kids:
                place(c, depth + 1)
            n['_x'] = (kids[0]['_x'] + kids[-1]['_x']) / 2

    def draw(n):
        for c in n['_kids']:
            d.edge((n['_x'], n['_y']), (c['_x'], c['_y']), r, r, c['e'], label=c.get('el'),
                   label_cls=c['e'] or 'muted')
            draw(c)
        d.circle(n['_x'], n['_y'], r, n['v'], n['k'], size=size)

    place(t, 0)
    draw(t)
