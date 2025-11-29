import requests

class GoogleSearchTool:
    name = "google_search"

    def search(self, query: str):
        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            "q": query,
            "key": "DEMO_KEY_REPLACE",
            "cx": "DEMO_CX_REPLACE"
        }
        response = requests.get(url, params=params)
        return response.json()
