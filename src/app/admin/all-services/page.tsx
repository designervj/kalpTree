import { getTestDatabase } from "@/lib/db/mongodb";

async function createDatabase(formData: FormData) {
  "use server";

  const dbName = formData.get("dbName") as string;
  const name = formData.get("name") as string;


  const db = await getTestDatabase(dbName);

  const collection = db.collection("users");

  await collection.insertOne({
    name,
    createdAt: new Date(),
  });
}

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        action={createDatabase}
        className="w-full max-w-md space-y-4 border p-6 rounded-lg shadow"
      >
        <h1 className="text-xl font-semibold">Create MongoDB Database</h1>

        <input
          type="text"
          name="dbName"
          placeholder="Database Name"
          required
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="text"
          name="name"
          placeholder="Name to insert"
          required
          className="w-full border px-3 py-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          Create DB & Insert
        </button>
      </form>
    </div>
  );
}
