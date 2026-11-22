---
title: File Handling
description: Opening and closing files with fopen modes, character, line and formatted I/O, reading until end of file, binary files with fread and fwrite, random access with fseek and ftell, and error handling.
sidebar:
  label: "8. File handling"
  order: 8
lesson:
  module: Programs and files
  prerequisites:
    - label: Structures and unions
      link: /structured-programming/structures-unions/
  outcomes:
    - Choose the right fopen mode for a task
    - Read and write text files with character, line and formatted functions
    - Read a file correctly until end of file
    - Store and retrieve structures in binary files, with random access
  keyIdea: >-
    Files are accessed through a `FILE *` returned by **fopen**, using a mode such as `"r"`, `"w"` or `"a"`. Text files are read and written with `fgetc`, `fgets` and `fprintf`-style functions; binary files with `fread` and `fwrite`. Always check that `fopen` succeeded and `fclose` the file when done.
---

## 1. Opening and closing

```c
FILE *fp = fopen("data.txt", "r");
if (fp == NULL) {
    perror("Cannot open data.txt");    // prints the reason, e.g. "No such file"
    return 1;
}
/* ... use the file ... */
fclose(fp);                            // flushes buffers and releases the file
```

| Mode | Opens for | If the file exists | If it doesn't |
|---|---|---|---|
| `"r"` | Reading | Read from the start | **Fails** (returns NULL) |
| `"w"` | Writing | **Erases** its contents | Creates it |
| `"a"` | Appending | Writes go to the end | Creates it |
| `"r+"` | Reading and writing | Starts at the beginning | Fails |
| `"w+"` | Reading and writing | Erases it | Creates it |
| `"a+"` | Reading and appending | Reads anywhere, writes at the end | Creates it |

Add `b` for binary files: `"rb"`, `"wb"`, `"ab"`. (On Windows this stops newline translation; on Unix it makes no difference.)

`stdin`, `stdout` and `stderr` are `FILE *` streams that are already open.

## 2. Text I/O functions

| Level | Write | Read |
|---|---|---|
| Character | `fputc(c, fp)` | `c = fgetc(fp)` (returns `EOF` at the end) |
| Line / string | `fputs(s, fp)` | `fgets(buf, size, fp)` (returns NULL at the end) |
| Formatted | `fprintf(fp, "%d %s\n", id, name)` | `fscanf(fp, "%d %s", &id, name)` (returns the number of items read, or `EOF`) |

**Copy a file, character by character:**

```c
int c;                          // int, not char, so EOF (-1) can be told apart
while ((c = fgetc(in)) != EOF)
    fputc(c, out);
```

**Count the lines in a file:**

```c
char line[256];
int count = 0;
while (fgets(line, sizeof line, fp) != NULL)
    count++;
```

**Write records, then read them back:**

```c
FILE *fp = fopen("students.txt", "w");
fprintf(fp, "%d %s %.2f\n", 101, "Rina", 3.75);
fclose(fp);

fp = fopen("students.txt", "r");
int id; char name[50]; float cgpa;
while (fscanf(fp, "%d %49s %f", &id, name, &cgpa) == 3)
    printf("%d %s %.2f\n", id, name, cgpa);
fclose(fp);
```

:::caution[The feof trap]
`while (!feof(fp)) { fgets(...); ... }` processes the last line twice, because `feof` only becomes true **after** a read has failed. Test the return value of the read function instead, as above.
:::

## 3. Binary files

Binary files store data exactly as it is in memory: compact and fast, but not human-readable and not portable between different machines.

```c
struct Student { int id; char name[50]; float cgpa; };

struct Student s = {101, "Rina", 3.75};
FILE *fp = fopen("students.dat", "wb");
fwrite(&s, sizeof(struct Student), 1, fp);    // write 1 record
fclose(fp);

struct Student r;
fp = fopen("students.dat", "rb");
while (fread(&r, sizeof(struct Student), 1, fp) == 1)
    printf("%d %s\n", r.id, r.name);
fclose(fp);
```

`fread` and `fwrite` return the number of **items** (not bytes) transferred.

## 4. Random access

| Function | Does |
|---|---|
| `fseek(fp, offset, origin)` | Move the file position; origin is `SEEK_SET` (start), `SEEK_CUR` (current) or `SEEK_END` (end) |
| `ftell(fp)` | Current position in bytes from the start |
| `rewind(fp)` | Go back to the start |

**Read the 5th record** of a binary file of fixed-size records:

```c
fseek(fp, 4 * sizeof(struct Student), SEEK_SET);   // records are numbered from 0
fread(&r, sizeof(struct Student), 1, fp);
```

**File size:**

```c
fseek(fp, 0, SEEK_END);
long size = ftell(fp);
```

## 5. Text vs binary

| | Text file | Binary file |
|---|---|---|
| Content | Characters; numbers stored as digit strings | Raw bytes, as in memory |
| Readable in an editor | Yes | No |
| Size | Usually larger (the number 12345 takes 5 characters) | Compact (an `int` takes 4 bytes) |
| Portability | Good | Depends on type sizes and byte order |
| Functions | `fprintf`, `fscanf`, `fgets`, `fputs` | `fread`, `fwrite` |

## Summary

- `fopen` returns a `FILE *` or NULL; check it, and `fclose` when done.
- `"w"` erases an existing file; `"a"` appends; `"r"` fails if the file doesn't exist; add `b` for binary.
- Read text with `fgetc` (into an `int`, compared with `EOF`), `fgets` or `fscanf`, and stop by testing their return values, not with `feof`.
- `fwrite` and `fread` move whole records; `fseek` and `ftell` give random access to fixed-size records.

## Check yourself

<details>
<summary>What happens if you open an existing file with "w"?</summary>

Its contents are erased (truncated to zero length) before writing begins. Use `"a"` to add to the end instead.
</details>

<details>
<summary>Why should the result of fgetc be stored in an int rather than a char?</summary>

`fgetc` returns every possible byte value (0–255) plus the special value `EOF` (usually −1). A `char` cannot hold all 257 possibilities, so EOF could be confused with a real byte.
</details>

<details>
<summary>How do you jump to the 10th record in a binary file of struct Item records?</summary>

`fseek(fp, 9 * sizeof(struct Item), SEEK_SET);` then `fread` one record.
</details>
