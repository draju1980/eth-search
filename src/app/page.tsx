import { SearchBar } from "@/components/search/search-bar";
import { BlockList } from "@/components/blocks/block-list";
import { TxList } from "@/components/transactions/tx-list";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="flex flex-col items-center gap-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Ethereum Blockchain Explorer
        </h1>
        <p className="text-lg text-muted-foreground text-center max-w-xl">
          Search for blocks, transactions, addresses, and ENS names on the Ethereum network.
        </p>
        <SearchBar />
      </section>

      <div className="grid gap-8 lg:grid-cols-2 mt-8">
        <section>
          <h2 className="mb-4 text-xl font-semibold">Latest Blocks</h2>
          <BlockList />
        </section>
        <section>
          <h2 className="mb-4 text-xl font-semibold">Latest Transactions</h2>
          <TxList />
        </section>
      </div>
    </div>
  );
}
