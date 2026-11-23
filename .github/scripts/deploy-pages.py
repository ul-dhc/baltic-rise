"""Deploy the uploaded artifact through GitHub's documented Pages REST API.

Use the upload step's artifact ID directly, avoiding a second artifact-service
lookup. Credentials stay in the Actions environment and are never logged.
"""
import json
import os
import time
import urllib.error
import urllib.request


def request(url, token, payload=None):
    headers = {"Authorization": "Bearer " + token,
               "Accept": "application/vnd.github+json",
               "X-GitHub-Api-Version": "2026-03-10"}
    if payload is not None:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, headers=headers,
                                 data=json.dumps(payload).encode() if payload is not None else None)
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        raise SystemExit("Pages request failed with HTTP " + str(error.code)) from None
    except urllib.error.URLError:
        raise SystemExit("Pages request could not reach GitHub.") from None


def main():
    artifact_id = os.environ["PAGES_ARTIFACT_ID"]
    if not artifact_id.isdecimal():
        raise SystemExit("The upload step did not return a valid artifact ID.")
    token = os.environ["GITHUB_TOKEN"]
    base = os.environ["GITHUB_API_URL"] + "/repos/" + os.environ["GITHUB_REPOSITORY"]
    identity = request(os.environ["ACTIONS_ID_TOKEN_REQUEST_URL"],
                       os.environ["ACTIONS_ID_TOKEN_REQUEST_TOKEN"])["value"]
    deployment = request(base + "/pages/deployments", token, {
        "artifact_id": int(artifact_id),
        "pages_build_version": os.environ["GITHUB_SHA"],
        "oidc_token": identity,
        "environment": "github-pages",
    })
    status_url = base + "/pages/deployments/" + str(deployment["id"])
    for _ in range(120):
        status = request(status_url, token).get("status")
        if status == "succeed":
            page_url = deployment.get("page_url") or request(base + "/pages", token)["html_url"]
            if not page_url.startswith(("https://", "http://")):
                page_url = "https://" + page_url
            with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as output:
                output.write("page_url=" + page_url + "\n")
            print("Pages deployment succeeded.")
            return
        if status in {"errored", "failed", "canceled", "cancelled", "deployment_failed"}:
            raise SystemExit("Pages deployment ended with status: " + status)
        time.sleep(3)
    raise SystemExit("Pages deployment did not finish within six minutes.")


if __name__ == "__main__":
    main()
