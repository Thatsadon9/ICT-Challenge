#!/usr/bin/env python3
"""Serve this self-contained course on loopback; no packages required."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
import json
import threading
import urllib.request
import webbrowser

ROOT = Path(__file__).resolve().parent

class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, '.wasm':'application/wasm', '.mjs':'text/javascript', '.js':'text/javascript'}

    def do_GET(self):
        if self.path == '/__tutor_health':
            body = json.dumps({'app':'ict-study-room','version':1}).encode()
            self.send_response(200)
            self.send_header('Content-Type','application/json')
            self.send_header('Content-Length',str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            super().do_GET()

    def log_message(self, fmt, *args):
        if len(args)<2 or str(args[1]) not in ('200','304'):
            super().log_message(fmt,*args)

def main():
    parser=argparse.ArgumentParser(description='ICT Study Room local web server')
    parser.add_argument('--port',type=int,default=8765)
    parser.add_argument('--no-browser',action='store_true')
    options=parser.parse_args()
    address=f'http://127.0.0.1:{options.port}'
    try:
        server=ThreadingHTTPServer(('127.0.0.1',options.port),partial(Handler,directory=str(ROOT)))
    except OSError:
        try:
            health=json.load(urllib.request.urlopen(address+'/__tutor_health',timeout=2))
            if health.get('app')=='ict-study-room':
                print(f'เว็บติวเปิดอยู่แล้ว: {address}',flush=True)
                if not options.no_browser:
                    webbrowser.open(address)
                return
        except Exception:
            pass
        raise SystemExit(f'Port {options.port} ถูกใช้อยู่ ลอง python3 start.py --port 8766')
    print(f'ICT Study Room: {address}',flush=True)
    print('เปิด URL นี้ในเบราว์เซอร์ได้เลย ปิดหน้าต่างนี้หรือกด Ctrl+C เพื่อหยุด',flush=True)
    if not options.no_browser:
        threading.Timer(.4,lambda:webbrowser.open(address)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

if __name__=='__main__':
    main()
