import re
from pathlib import Path
source = Path(r"C:\Users\POS3\OneDrive - Catering Solutions Pte. Ltd\Desktop\Gayatri-Portal-DB-script.txt")
text = source.read_text(encoding='utf-8', errors='ignore')
# capture CREATE TABLE blocks
pattern = re.compile(r"CREATE TABLE \[dbo\]\.\[([^\]]+)\]\((.*?)\)\s*ON \[PRIMARY\]", re.S | re.I)
entries = pattern.findall(text)
output = []
for name, body in entries:
    cols = []
    for line in body.splitlines():
        line = line.strip()
        if not line or line.upper().startswith('PRIMARY KEY') or line.upper().startswith('CONSTRAINT') or line.startswith(')'):
            continue
        m = re.match(r"\[([^\]]+)\] \[([^\]]+)\](\([^\)]*\))?( .*?)?(NOT NULL|NULL|IDENTITY\([^\)]*\)|PRIMARY KEY|UNIQUE|DEFAULT[^,]*)?(,)?$", line, re.I)
        if m:
            colname = m.group(1)
            coltype = m.group(2)
            collen = m.group(3) or ''
            constraint = (m.group(4) or '') + ' ' + (m.group(5) or '')
            cols.append({'name': colname, 'type': coltype, 'size': collen.strip(), 'constraint': constraint.strip()})
        else:
            # fallback simpler
            m2 = re.match(r"\[([^\]]+)\] \[([^\]]+)\](\([^\)]*\))?", line)
            if m2:
                cols.append({'name': m2.group(1), 'type': m2.group(2), 'size': m2.group(3) or '', 'constraint': ''})
            else:
                cols.append({'raw': line})
    output.append({'table': name, 'columns': cols})
out_file = Path('sql_table_defs.json')
out_file.write_text(repr(output), encoding='utf-8')
print(f"wrote {len(output)} tables to {out_file}")
