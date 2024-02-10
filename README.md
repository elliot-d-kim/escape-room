# escape-room

A web-based escape room game.

## Table of Contents

- [Contributors](#contributors)
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
    - [4. Install `pg` and `pg-hstore`](#4-install-pg-and-pg-hstore)
    - [5. Initialize Sequelize](#5-initialize-sequelize)
    - [6. Update `config/config.json`](#6-update-configconfigjson)

## Contributors
* Elliot Kim (GitHub @elliot-d-kim)
* Eunice Lee (GitHub @user101301)
* Jiho Kim (GitHub @shakenBeef)
* Haru Chang (harumahnchang@gmail.com)
* Kevin Hwang (IG @kevinky_art)

## Installation for developers

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

### 4. Install `pg` and `pg-hstore`

### 5. Initialize Sequelize

### 6. Update `config/config.json`


