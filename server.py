import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

class ThreadedHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

def run():
    os.chdir(DIRECTORY)
    with ThreadedHTTPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print("===========================================================")
        print("  शिक्षासेतु (ShikshaSetu) - Balbharati Learning Portal")
        print(f"  Server running at: {url}")
        print(f"  Serving directory: {DIRECTORY}")
        print("===========================================================")
        print("Press Ctrl+C to stop the server.")
        
        # Open in default web browser
        try:
            webbrowser.open(url)
        except Exception as e:
            print(f"Could not open browser automatically: {e}")
            
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            sys.exit(0)

if __name__ == "__main__":
    run()
