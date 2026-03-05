"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { classifySearch } from "@/lib/search";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!query.trim()) return;

    const result = classifySearch(query.trim());

    if (result.type === "ens") {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.data?.redirect) {
          router.push(data.data.redirect);
          return;
        }
        setError("ENS name not found");
      } catch {
        setError("Failed to resolve ENS name");
      }
      return;
    }

    if (result.type === "unknown") {
      setError("Enter a valid block number, tx hash, address, or ENS name");
      return;
    }

    router.push(result.redirect);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by address, tx hash, block number, or ENS name..."
            className="pl-9"
          />
        </div>
        <Button type="submit">Search</Button>
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </form>
  );
}
