# Installation

Install [Node.js](https://pip.pypa.io/en/stable/) before running this project and use this command to check

```bash
> node

Welcome to Node.js v15.0.1.
Type ".help" for more information.
> 
```

Install npm module by **access to the project folder** and use the command 

```bash
> npm install

up to date, audited 253 packages in 1s

14 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Import Database schema from buddy.sql in the export folder

Import Postman API from Buddy.postman_collection in the export folder

Set database config in src\database.ts

```typescript
private connection = createPool({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'buddy',
        connectionLimit : 2,
})
```

Convert Typescript to Node.js

```bash
> tsc
```
After running the previous command there is a dist folder in the project

Run the project

```bash
> node dist\index.js

Server start on port  5000
```

# API Document

## Get all notes
### Request

```http
[GET] /
```

### Responses [200]

```typescript
{
    "msg": [
        {
            "title": string,
            "content": string,
            "createdAt": datetime,
            "tags": [],
            "id": number
        }
    ]
}
```

## Create Note
### Request
```http
[POST] /
```
### Header
```http
Content-Type: application/json
```
### Body
```http
{
    "title": string,
    "content": string
}
```
| Body| Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Note title |
| `content` | `string` | Note content |
### Response [200]
```http
{
    "msg": "Create Note success"
}
```

## Search by header
### Request
```http
[GET] /?search_column=[header]&search_data=[data]
```
| Parameter| Type | Description |
| :--- | :--- | :--- |
| `search_column` | `string` | Column that you want to search |
| `search_data` | `string` | Data that you want to search |
| `[header]` | `string` | Contains [id, title, content, createdAt and tags]|
| `[data]` | `string` | Whatever that you want to search in the herder |
### Response [200]
```http
{
    "msg": [
        {
            "title": string,
            "content": string,
            "createdAt": datetime,
            "tags": [
                string
            ],
            "id": int
        }
    ]
}
```

## Sort by header
### Request
```http
[GET] /?sort_column=[header]&sort_direction=[data]
```
| Parameter| Type | Description |
| :--- | :--- | :--- |
| `sort_column` | `string` | Column that you want to sort |
| `sort_direction` | `string` | Data that you want to sort |
| `[header]` | `string` | Contains [id, title, content, createdAt and tags]|
| `[data]` | `string` | Contains[ASC, DESC] |
### Response [200]
```http
{
    "msg": [
        {
            "title": string,
            "content": string,
            "createdAt": datetime,
            "tags": [
                string
            ],
            "id": 1
        }
    ]
}
```

## Edit Note
### Request
```http
[PUT] /
```
### Header
```http
Content-Type: application/json
```
### Body
```http
{
    "id": int,
    "title": string,
    "content": string
}
```
| Body| Type | Description |
| :--- | :--- | :--- |
| `id` | `int` | Note ID |
| `title` | `string` | Note title |
| `content` | `string` | Note content |
### Response [200]
```http
{
    "msg": string
}
```

## Delete Note
### Request
```http
[GET] /?id=[data]
```
| Parameter| Type | Description |
| :--- | :--- | :--- |
| `id` | | Note ID |
| `[data]` | `string` | Note ID that you want to delete |
### Response [200]
```http
{
    "msg": string
}
```

## Get all tags
### Request
```http
[GET] /tags
```
### Response [200]
```http
{
    "msg": [
        {
            "tagID": 1,
            "name": "testCreateTag1"
        }
    ]
}
```

## Search tag by tag name
### Request
```http
[GET] /tags?name=[data]
```
| Parameter| Type | Description |
| :--- | :--- | :--- |
| `name` | | Tage name |
| `[data]` | `string` | Tage name that you want to search |
### Response [200]
```http
{
    "msg": [
        {
            "tagID": 1,
            "name": "testCreateTag1"
        }
    ]
}
```

## Create tag
### Request
```http
[POST] /tags
```
### Header
```http
Content-Type: application/json
```
### Body
```http
{
    "name": string
}
```
| Body| Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | Tag name |
### Response [200]
```http
{
    "msg": string
}
```

## Delete tag
### Request
```http
[DELETE] /tags?name=[data]
```
| Parameter| Type | Description |
| :--- | :--- | :--- |
| `name` | | Tage name |
| `[data]` | `string` | Tage name that you want to delete|
### Response [200]
```http
{
    "msg": string
}
```

## Edit tag
### Request
```http
[PUT] /tags
```
### Header
```http
Content-Type: application/json
```
### Body
```http
{
    "name": string,
    "new_name": string
}
```
| Body| Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | Tag name (old) |
| `new_name` | `string` | Tag name (new)|
### Response [200]
```http
{
    "msg": string
}
```

## Map Note-Tag
### Request
```http
[PUT] /map
```
### Header
```http
Content-Type: application/json
```
### Body
```http
{
    "noteID": int,
    "tagID": int
}
```
| Body| Type | Description |
| :--- | :--- | :--- |
| `noteID` | `string` | Note ID |
| `tagID` | `string` | Tag ID|
### Response [200]
```http
{
    "msg": string
}
```

## Remove Tag from note
### Request
```http
[DELETE] /map?noteID=[noteID]&tagID=[tagID]
```
| Parameter| Type | Description |
| :--- | :--- | :--- |
| `noteID` |  | Note ID |
| `[noteID]` | `string` | Note ID that you want to remove tag|
| `tagID` |  | Note ID |
| `[tagID]` | `string` | Tag ID that you want to remove from note|
### Response [200]
```http
{
    "msg": string
}
```