# How to Contribute

This document primarily informs internal developers on set-up and development best practices.

## Table of Contents

- [Installation for developers](#installation-for-developers)
    - [1. Install PostgreSQL](#1-install-postgresql)
    - [2. Set up PostgreSQL](#2-set-up-postgresql)
        - [2.1 Set up `postgres` superuser](#21-set-up-postgres-superuser)
        - [2.2 Create a new database](#22-create-a-new-database)
        - [2.3 Create a new user account](#23-create-a-new-user-account)
            - [2.3.a Keep peer authentication](#23a-keep-peer-authentication)
            - [2.3.b Switch to password authentication](#23b-switch-to-password-authentication)
        - [2.4 Assign privileges](#24-assign-privileges)
        - [2.5 Connect as the new user](#25-connect-as-the-new-user)
    - [3. Install Sequelize](#3-install-sequelize)
    - [4. Status on `sequelize-cli`](#4-status-on-sequelize-cli)
    - [5. Initialize Sequelize](#5-initialize-sequelize)
    - [6. Update `config/config.json`](#6-update-configconfigjson)
    
## Installation for developers

For installation on Windows, follow the steps on [PostgreSQL Tutorial](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/).
* Note: Install PostgreSQL 14.x instead of version 16.
* Create new database and user in pgAdmin 4
    * User: can login, create roles, create dbs, inherit rights

The following steps are for Ubuntu 22.04.

### 1. Install PostgreSQL
Retrieve any available package updates and install them.
```bash
sudo apt update
sudo apt ugrade
```

Install PostgreSQL (version 14.10).
```bash
sudo apt install postgresql-14
```

Double-check the PostgreSQL version.
```bash
psql --version
```

### 2. Set up PostgreSQL

#### 2.1 Set up `postgres` superuser

By default, PostgreSQL creates a superuser named `postgres` that has access to all local PostgreSQL projects. Enter `psql`, the PostgreSQL terminal, with this account.
```bash
sudo -u postgres psql
```

(Optional) Set a password for the `postgres` user.
```sql
\password postgres
```
Enter and confirm your password.

#### 2.2 Create a new database

Feel free to view existing PostgreSQL projects. Upon a fresh installation, there should be three databases present: `postgres`, `template0`, and `template1`.
```sql
\l
```

Create a new database for this project. (Consider whether this will be a shared database or whether each developer will have their own local database.)
```sql
CREATE DATABASE escape_room;
```

#### 2.3 Create a new user account

PostgreSQL has some quirks around user authentication, on Unix-like systems at least: by default, PostgreSQL uses "peer authentication" for local connections. This means that it authenticates log-ins by comparing the entered username with the username on the OS. Without going into the details of why this authentication method might be the default, one convenience is not needing a password.

However, this isn't compatible with creating project-specific users or multiple users, which have some benefits such as separating access privileges between projects in a clearer manner.

Refer to the official documentation for more info:
* [Authentication Methods](https://www.postgresql.org/docs/14/auth-methods.html)
* [Peer Authentication](https://www.postgresql.org/docs/14/auth-peer.html)
* [Password Authentication](https://www.postgresql.org/docs/14/auth-password.html)

Instructions for both approaches follow.

##### 2.3.a Keep peer authentication

For peer authentication, your username must match the username on your system. On Unix-like systems, check your username by running `whoami` in the terminal. (Exit `psql` with `\q` to reach the terminal. To return to `psql`, run `sudo -u postgres psql`.)

Create a new PostgreSQL user for your local workspace. Run the following command in `psql`. Replace `developer_1` with your system username and `password1` with your desired credentials. (Password is optional.)
```sql
-- With password
CREATE USER developer_1 WITH PASSWORD 'password1';

-- Without password
CREATE USER developer_1;
```

##### 2.3.b Switch to password authentication

PostgreSQL allows several ways to implement a project-specific log-in flow for a variety of different use cases. Mapping was considered, but here an md5-encrypted approach was selected.

Open `pg_hba.conf` from the terminal. Here, `nano` is the text editor that will be used to edit this config file. Note that `14` is the PostgreSQL version number.
```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

Use the arrow keys to reach the bottom of `pg_hba.conf`. Add the following entry. Replace `developer_1` with the username you plan to use to log in to the `escape_room` database.
```
# TYPE  DATABASE        USER            ADDRESS     METHOD
...     ...             ...             ...         ...

# Escape Room Game
local   escape_room     developer_1                 md5
```
On your keyboard, hit `Ctrl+X` to exit, `Y` to save changes, then `Enter` to keep the filename unchanged.

From the terminal, log in again as `postgres`.
```bash
sudo -u postgres psql
```

Create a new user specific to this project. Replace `developer_1` and `password1` with your desired credentials.
```sql
CREATE USER developer_1 WITH PASSWORD 'password1';
```
If multiple developers will be accessing this database (presumably remotely), create separate user accounts for each developer. Note that working asynchronously without a central server will pose a challenge to sharing a database, and in early development stages for a small-scale team, developers may find it most practical to host a local copy of the database. More on maintaining consistency across locally hosted databases later.

#### 2.4 Assign privileges

Now assign database access privileges to the user(s).
```sql
-- Grant all privileges to Developer 1
GRANT ALL PRIVILEGES ON DATABASE escape_room TO developer_1;

-- Grant specific privileges to Developer 2
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO developer_2;
```

Check the database, user, and access privileges. A new database named `escape_room` owned by `postgres` should be among the entries. Your new user account should also be listed under `escape_room`'s `Access privileges`.
```sql
\l
```

#### 2.5 Connect as the new user

While the `postgres` superuser may own the `escape_room` database, refrain from using `postgres` to access and make changes to the database. Disconnect from `psql`.
```sql
\q
```

From now on, use the non-superuser account to access the database.
```bash
psql -U developer_1 -d escape_room -localhost
```

You should see the following prompt.
```sql
escape_room=> 
```

### 3. Install Sequelize

At this time, Sequelize is the best database interaction solution for this project. Sequelize is an ORM, providing developers an abstraction layer on top of SQL. Instead of writing raw SQL queries, developers can use methods provided by the ORM to define database schemas and interact with the database.

Though using raw SQL can be simpler for small projects such as this one, this project is subject to structural adjustments as we developers learn on the job. Without an ORM, any changes to database schema would require updating every related raw SQL query. Thus, using an ORM would be a more robust approach.

There are many ORMs out there, and for Node.js backends, TypeORM, Mongoose, and Prisma are some of the more popular alternatives to Sequelize. However, Sequelize is the most mature of these with extensive resources and community support (important for learning developers). The following are additional reasons to not proceed with the alternatives:
* TypeORM: designed for TypeScript projects
* Mongoose: for projects using MongoDB databases
* Prisma: popular among developers but the least mature of these by far

The steps to install Sequelize (v6) and the relevant drivers can be found in their [documentation](https://sequelize.org/docs/v6/getting-started/). Below are the steps specific to this project.

Install sequelize with Node Package Manager. This project uses Sequelize 6.37.1.
```bash
npm install --save sequelize
```

Install the relevant driver for PostgreSQL. This project uses pg 8.11.3 and pg-hstore 2.3.4.
```bash
npm install --save pg pg-hstore
```

### 4. Install `sequelize-cli`

Though `sequelize-cli` is not necessary, it gives developers access to some simple commands without adding much overhead or runtime dependencies. We will see when we initialize Sequelize, `sequelize-cli` gives developers access to the `init` command, which is much simpler than the alternative methods, which include:
* Manually setting up Sequelize directories and configuration
* Using custom scripts
* Using boilerplate templates
* Relying on integrated frameworks, e.g., NestJS or AdonisJS

For the sake of minimal overhead and simplicity appropriate for learning developers, we will proceed with the default set up offered by `sequelize-cli`, though we may revisit these alternative methods.

The instructions for installing `sequelize-cli` can be found in their [documentation](https://github.com/sequelize/cli).
```bash
npm install --save-dev -g sequelize-cli
```

### 5. Initialize Sequelize

In your project directory, initialize Sequelize with default configurations.
```bash
sequelize init
```

### 6. Update `config/config.json`


