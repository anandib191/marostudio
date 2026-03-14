# Hero Section Photos — How to Replace

This folder is your guide to updating the Hero Section photos on the website.

---

## How It Works

The hero section shows **7 product sets** (a1 to a7).

Each set has **2 types of photos**:

| Type | File Name | What it shows |
|------|-----------|----------------|
| **BEFORE** | `a1-main.jpg` | The original product photo (raw, unedited) |
| **AFTER 1** | `a1-1.png` | AI-generated result — variation 1 |
| **AFTER 2** | `a1-2.png` | AI-generated result — variation 2 |
| **AFTER 3** | `a1-3.png` | AI-generated result — variation 3 |

The website automatically cycles through AFTER 1 → 2 → 3, then moves to the next product set.

---

## Folder Location (where to replace files)

All photos are stored here inside the project:

```
public/
  assets/
    images/
      hero-carousel/
        a1/              ← Product Set 1
          a1-main.jpg    ← BEFORE photo
          a1-1.png       ← AFTER photo 1
          a1-2.png       ← AFTER photo 2
          a1-3.png       ← AFTER photo 3
          webp/          ← Auto-optimized WebP versions (same files, .webp format)
            a1-main.webp
            a1-1.webp
            a1-2.webp
            a1-3.webp
        a2/              ← Product Set 2
          a2-main.png
          a2-1.png  ...  (same pattern)
        a3/ ... a7/      ← Sets 3 to 7 (same pattern)
```

---

## How to Replace a Photo

1. **Find the set** you want to replace (a1, a2, ... a7)
2. **Replace the file** with your new photo, keeping the **exact same file name**
   - Replace BEFORE → keep name `a1-main.jpg` (or `.png` for a2–a7)
   - Replace AFTER 1 → keep name `a1-1.png`
   - Replace AFTER 2 → keep name `a1-2.png`
   - Replace AFTER 3 → keep name `a1-3.png`
3. **Also replace** the `.webp` version inside the `webp/` subfolder with the same image saved as `.webp`

> **Tip:** Use [squoosh.app](https://squoosh.app) to convert your PNG/JPG to WebP for free.

---

## Quick Reference: All 7 Product Sets

| Set | Before File | After Files |
|-----|-------------|-------------|
| a1 | `a1/a1-main.jpg` | `a1/a1-1.png`, `a1/a1-2.png`, `a1/a1-3.png` |
| a2 | `a2/a2-main.png` | `a2/a2-1.png`, `a2/a2-2.png`, `a2/a2-3.png` |
| a3 | `a3/a3-main.png` | `a3/a3-1.png`, `a3/a3-2.png`, `a3/a3-3.png` |
| a4 | `a4/a4-main.png` | `a4/a4-1.png`, `a4/a4-2.png`, `a4/a4-3.png` |
| a5 | `a5/a5-main.png` | `a5/a5-1.png`, `a5/a5-2.png`, `a5/a5-3.png` |
| a6 | `a6/a6-main.png` | `a6/a6-1.png`, `a6/a6-2.png`, `a6/a6-3.png` |
| a7 | `a7/a7-main.png` | `a7/a7-1.png`, `a7/a7-2.png`, `a7/a7-3.png` |
