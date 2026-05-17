import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface Bookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  ayahText: string;
  savedAt: number;
}

interface BookmarksContextValue {
  bookmarks: Bookmark[];
  isBookmarked: (surahNumber: number, ayahNumber: number) => boolean;
  addBookmark: (bookmark: Bookmark) => Promise<void>;
  removeBookmark: (surahNumber: number, ayahNumber: number) => Promise<void>;
  toggleBookmark: (bookmark: Bookmark) => Promise<void>;
}

const BookmarksContext = createContext<BookmarksContextValue | null>(null);
const STORAGE_KEY = "bookmarks_v1";

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setBookmarks(JSON.parse(raw));
    });
  }, []);

  const save = useCallback(async (updated: Bookmark[]) => {
    setBookmarks(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const isBookmarked = useCallback(
    (surahNumber: number, ayahNumber: number) =>
      bookmarks.some((b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber),
    [bookmarks]
  );

  const addBookmark = useCallback(
    async (bookmark: Bookmark) => {
      if (isBookmarked(bookmark.surahNumber, bookmark.ayahNumber)) return;
      await save([bookmark, ...bookmarks]);
    },
    [bookmarks, isBookmarked, save]
  );

  const removeBookmark = useCallback(
    async (surahNumber: number, ayahNumber: number) => {
      await save(bookmarks.filter((b) => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)));
    },
    [bookmarks, save]
  );

  const toggleBookmark = useCallback(
    async (bookmark: Bookmark) => {
      if (isBookmarked(bookmark.surahNumber, bookmark.ayahNumber)) {
        await removeBookmark(bookmark.surahNumber, bookmark.ayahNumber);
      } else {
        await addBookmark(bookmark);
      }
    },
    [isBookmarked, addBookmark, removeBookmark]
  );

  return (
    <BookmarksContext.Provider value={{ bookmarks, isBookmarked, addBookmark, removeBookmark, toggleBookmark }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks(): BookmarksContextValue {
  const ctx = useContext(BookmarksContext);
  if (!ctx) throw new Error("useBookmarks must be inside BookmarksProvider");
  return ctx;
}
