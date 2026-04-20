#!/bin/bash
# =============================================================================
# init-db.sh — Khởi động SQL Server và khởi tạo cơ sở dữ liệu BlindBagDb
# =============================================================================
# Strategy:
#   1. Start SQL Server in background
#   2. Wait until SQL Server is ready to accept connections
#   3. Execute init-db.sql to create the database (and initial schema/data)
#   4. Bring SQL Server to foreground so the container stays alive

set -e  # Exit immediately on any error

# --- Configuration (inherits from Docker ENV) ---
SA_PASSWORD="${SA_PASSWORD:-BlindBag@SA_2024!}"
INIT_SQL="/usr/src/app/init-db.sql"
MAX_RETRIES=30
SLEEP_SECONDS=2

echo "=========================================="
echo " BlindBag Marketplace — SQL Server Init"
echo "=========================================="

# 1. Start SQL Server in the background
echo "[INFO] Starting SQL Server..."
/opt/mssql/bin/sqlservr &
MSSQL_PID=$!

# 2. Wait for SQL Server to be ready
echo "[INFO] Waiting for SQL Server to be ready..."
retry_count=0
until /opt/mssql-tools18/bin/sqlcmd \
        -S localhost \
        -U SA \
        -P "${SA_PASSWORD}" \
        -Q "SELECT 1" \
        -No \
        > /dev/null 2>&1; do

    retry_count=$((retry_count + 1))

    if [ $retry_count -ge $MAX_RETRIES ]; then
        echo "[ERROR] SQL Server did not become ready after $((MAX_RETRIES * SLEEP_SECONDS)) seconds. Exiting."
        exit 1
    fi

    echo "[INFO] SQL Server not ready yet. Retrying ($retry_count/$MAX_RETRIES)..."
    sleep $SLEEP_SECONDS
done

echo "[INFO] SQL Server is ready!"

# 3. Run the initialization SQL script
echo "[INFO] Running initialization script: $INIT_SQL"
/opt/mssql-tools18/bin/sqlcmd \
    -S localhost \
    -U SA \
    -P "${SA_PASSWORD}" \
    -i "$INIT_SQL" \
    -No

echo "[INFO] Database initialization completed successfully."
echo "=========================================="

# 4. Keep the container alive by waiting for the SQL Server process
wait $MSSQL_PID
