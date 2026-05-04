"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import styles from "./page.module.scss";
import { ApiService } from "@/services/api.service";
export const dynamic = "force-dynamic";

interface SearchItem {
  id: number;
  title: string;
  url: string;
  type: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = new ApiService().getBaseUrl();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${baseUrl}wp-json/wp/v2/search?search=${encodeURIComponent(
            query
          )}&per_page=20`
        );

        const data = await res.json();

        const formatted = data.map((item: any) => {
          const relativePath = item.url.replace(baseUrl, "");
          return {
            id: item.id,
            title: item.title,
            url: relativePath.startsWith("/") ? relativePath : `/${relativePath}`, // convert to absolute frontend route
            type: item.subtype || item.type,
          };
        });

        setResults(formatted);
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <main>
      <section className={styles.container}>
        <div className="container">
          {/* Search Box */}
          <div className={styles.searchHeader}>
            <div className={styles.searchBoxWrapper}>
              <div className={styles.searchInputGroup}>
                <Search className={styles.searchIcon} size={24} />
                <input
                  type="text"
                  placeholder="Search services, blogs, pages..."
                  className={styles.input}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            {query && !loading && (
              <p className={styles.resultsCount}>
                Found {results.length} result
                {results.length !== 1 ? "s" : ""} for "{query}"
              </p>
            )}
          </div>

          {/* Results */}
          <div className={styles.resultsList}>
            {loading ? (
              <p>Searching...</p>
            ) : results.length > 0 ? (
              results.map((item) => (
                <div key={item.id} className={styles.resultCard}>
                  <span className={styles.resultCategory}>
                    {item.type}
                  </span>

                  <h3 className={styles.resultTitle}>
                    <Link href={item.url}>{item.title}</Link>
                  </h3>

                  <Link
                    href={item.url}
                    className={styles.readMore}
                  >
                    View Page <ArrowRight size={16} />
                  </Link>
                </div>
              ))
            ) : query ? (
              <div className={styles.noResults}>
                <h3>No results found</h3>
                <p>Try different keywords.</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
