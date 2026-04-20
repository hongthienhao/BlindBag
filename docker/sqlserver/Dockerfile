# =============================================================================
# Dockerfile: SQL Server 2019 (Linux) for BlindBag Marketplace
# =============================================================================
# Base image: Microsoft SQL Server 2019 on Ubuntu
FROM mcr.microsoft.com/mssql/server:2019-latest

# --- Environment Variables ---
# Accept the End-User Licensing Agreement (required by Microsoft)
ENV ACCEPT_EULA=Y

# SA (System Administrator) password - must meet SQL Server complexity requirements:
#   - Minimum 8 characters
#   - Contains uppercase, lowercase, digits, and special characters
ENV SA_PASSWORD=BlindBag@SA_2024!

# SQL Server edition: Developer (free, full-featured, for non-production use)
# Other options: Express | Standard | Enterprise | EnterpriseCore
ENV MSSQL_PID=Developer

# Set the default database collation (Vietnamese-friendly)
ENV MSSQL_COLLATION=SQL_Latin1_General_CP1_CI_AS

# Optional: Enable SQL Server Agent (set to 1 to enable)
ENV MSSQL_AGENT_ENABLED=false

# --- Working directory ---
WORKDIR /usr/src/app

# --- Copy initialization scripts ---
# Switch to root to copy files and set permissions
USER root

COPY init/init-db.sh  /usr/src/app/init-db.sh
COPY init/init-db.sql /usr/src/app/init-db.sql

# Make the shell script executable
RUN chmod +x /usr/src/app/init-db.sh

# --- Switch back to mssql user (least-privilege principle) ---
USER mssql

# --- Expose SQL Server default port ---
EXPOSE 1433

# --- Entrypoint ---
# Run init-db.sh which starts SQL Server AND executes the SQL initialization script
CMD ["/bin/bash", "/usr/src/app/init-db.sh"]
