#!/usr/bin/env bash
#
# Manual one-command deploy: build -> sync to S3 -> invalidate CloudFront.
# Uses your local AWS credentials (aws configure / SSO). The GitHub Action in
# .github/workflows/deploy.yml does the same thing automatically on push to main;
# this script is for ad-hoc deploys from your machine.
#
# Usage:
#   ./deploy.sh
#
# Configure these once, either by editing the defaults below or by exporting
# them in your shell before running:
#   S3_BUCKET=my-bucket CLOUDFRONT_DIST_ID=E123ABC ./deploy.sh

set -euo pipefail

S3_BUCKET="${S3_BUCKET:-YOUR_BUCKET}"
CLOUDFRONT_DIST_ID="${CLOUDFRONT_DIST_ID:-YOUR_DISTRIBUTION_ID}"

if [[ "$S3_BUCKET" == "YOUR_BUCKET" || "$CLOUDFRONT_DIST_ID" == "YOUR_DISTRIBUTION_ID" ]]; then
  echo "Set S3_BUCKET and CLOUDFRONT_DIST_ID (edit deploy.sh or export them) first." >&2
  exit 1
fi

echo "==> Building..."
npm run build

echo "==> Syncing hashed assets (immutable cache)..."
aws s3 sync dist/ "s3://${S3_BUCKET}/" \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude index.html

echo "==> Uploading index.html (no-cache)..."
aws s3 cp dist/index.html "s3://${S3_BUCKET}/index.html" \
  --cache-control "no-cache"

echo "==> Invalidating CloudFront..."
aws cloudfront create-invalidation \
  --distribution-id "${CLOUDFRONT_DIST_ID}" \
  --paths "/" "/index.html"

echo "==> Done."
