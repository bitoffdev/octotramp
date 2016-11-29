import http.server, pickle, urllib.parse

LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
# Location to store the leaderboard
PICKLE_LOCATION = "scores.p"
# List of paths the user is permitted to access
STATIC_PATHS = ["index.html", "manifest.appcache",
         "sketch.js", "waitingscreen.js", "deathscreen.js", "environment.js",
         "flashyboxofgoodies.js", "libraries/p5.js",
         "assets/title_logo.png", "assets/octocat.png", "assets/hubot.jpg",
         "assets/cute_balloon.jpg", "assets/github-homepage.jpg",
         "assets/rainbow-straight.jpg", "assets/trampoline.png",
         "assets/some-loser.png"]

def load_scores():
    """Returns a list of tuples loaded from the pickle file"""
    try:
        with open(PICKLE_LOCATION, 'rb') as fh:
            return pickle.load(fh);
    except IOError:
        return []

def get_leaderboard():
    """Returns a print-friendly string of the top 10 on the leaderboard"""
    return bytes("\n".join(map(lambda x: "%s%4d"%x, scores[:15])), "utf-8")

def save_score(name, score):
    """Inserts a name-score tuple to the ordered scores list and records all
    scores to the pickle file
    """
    # Validate the score
    if score > 500 or any((c not in LETTERS) for c in name):
        print("REJECTED INVALID NAME")
        return
    if len(name) > 15:
        name = name[:12] + "..."
    # Insert the score
    insert = 0
    while insert < len(scores) and score <= scores[insert][1]:
        insert += 1
    scores.insert(insert, (name, score))
    with open(PICKLE_LOCATION, 'wb') as fh:
        pickle.dump(scores, fh);

class Handler (http.server.BaseHTTPRequestHandler):
    """Implements the BaseHTTPRequestHandler"""
    def do_GET(self):
        """Handles GET requests, which is the only type used by this server"""
        # Redirect root requests to the index html page
        if self.path=="/":
            self.path = "/index.html"
        # Serve dynamic content
        if self.path[1:12] == "leaderboard":
            # Return the leaderboard
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(get_leaderboard())
            # If a highscore was submitted, record it
            if "?" in self.path:
                query = urllib.parse.parse_qs(self.path.rsplit("?")[-1])
                if "name" in query and "score" in query:
                    save_score(query["name"][0], int(query["score"][0]))
        # Serve static content
        elif self.path[1:] in STATIC_PATHS:
            self.send_response(200)
            if ".png" in self.path:
                self.send_header("Content-type", "image/png")
            elif ".jpg" in self.path:
                self.send_header("Content-type", "image/jpg")
            elif ".appcache" in self.path:
                self.send_header("Content-type", "text/cache-manifest")
            else:
                self.send_header("Content-type", "text/html")
            self.end_headers()
            with open(self.path[1:], 'rb') as fh:
                self.wfile.write(fh.read())
        # Serve page not found
        else:
            self.send_response(404)
            self.end_headers()


def run(server_class=http.server.HTTPServer, handler_class=http.server.BaseHTTPRequestHandler):
    """Starts the server and runs it forever"""
    server_address = ('', 8000)
    try:
        httpd = server_class(('', 80), handler_class)
        print("Server started on port 80")
    except PermissionError:
        httpd = server_class(('', 8000), handler_class)
        print("Permission denied on port 80")
        print("Server started on port 8000")
    httpd.serve_forever()

if __name__=="__main__":
    scores = load_scores()
    run(handler_class=Handler)
