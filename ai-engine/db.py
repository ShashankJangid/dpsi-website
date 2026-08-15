import sqlite3
import json
from datetime import datetime
from config import DB_PATH

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes master audit and lead tracking database tables."""
    conn = get_db()
    cursor = conn.cursor()
    
    # Audit Log Table (Every action recorded)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            agent_name TEXT NOT NULL,
            action_type TEXT NOT NULL,
            target TEXT,
            status TEXT NOT NULL,
            details TEXT
        )
    ''')
    
    # Lead Discovery & Audit Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_name TEXT NOT NULL,
            website TEXT UNIQUE NOT NULL,
            email TEXT,
            audit_score INTEGER,
            bugs_count INTEGER,
            report_path TEXT,
            status TEXT DEFAULT 'DISCOVERED',
            email_sent_at TEXT,
            created_at TEXT NOT NULL
        )
    ''')

    # Social Media Content Log Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS social_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            platform TEXT NOT NULL,
            caption TEXT NOT NULL,
            published_at TEXT NOT NULL,
            status TEXT DEFAULT 'PUBLISHED'
        )
    ''')
    
    conn.commit()
    conn.close()

def log_action(agent_name: str, action_type: str, target: str, status: str, details: dict = None):
    """Records every AI action into the master log."""
    conn = get_db()
    cursor = conn.cursor()
    timestamp = datetime.now().isoformat()
    details_str = json.dumps(details) if details else ""
    
    cursor.execute('''
        INSERT INTO audit_logs (timestamp, agent_name, action_type, target, status, details)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (timestamp, agent_name, action_type, target, status, details_str))
    
    conn.commit()
    conn.close()
    print(f"--> [AUDIT LOG] {timestamp} | {agent_name} | {action_type} | Status: {status}")

def save_lead(company_name: str, website: str, email: str = None, audit_score: int = 0, bugs_count: int = 0, report_path: str = None):
    """Saves or updates a discovered lead."""
    conn = get_db()
    cursor = conn.cursor()
    created_at = datetime.now().isoformat()
    
    cursor.execute('''
        INSERT INTO leads (company_name, website, email, audit_score, bugs_count, report_path, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(website) DO UPDATE SET
            audit_score=excluded.audit_score,
            bugs_count=excluded.bugs_count,
            report_path=excluded.report_path
    ''', (company_name, website, email, audit_score, bugs_count, report_path, created_at))
    
    conn.commit()
    conn.close()

def get_recent_logs(limit: int = 10):
    """Returns recent audit logs."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY id DESC LIMIT ?", (limit,))
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")
