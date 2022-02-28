import { PublicKey } from "@solana/web3.js"
import { useWallet } from "@solana/wallet-adapter-react"
import idl from "../src/idl.json"

export default function Home() {
  const programId = new PublicKey(idl.metadata.address)
  const network = "http://localhost:8899"
  const preflightCommitment = "processed"
  const wallet = useWallet()

  // Gets an instance of the provider
  async function getProvider() {
    const connection = new Connection(network, preflightCommitment)
    const provider = new Provider(connection, wallet, preflightCommitment)
    return provider
  }
  async function createSafe() {
    const provider = await getProvider()
    const program = new Program(idl, programId, provider)
    await program.rpc.createMultisig({})
  }
  return (
    <div className="flex flex-col justify-center h-screen items-center">
      <h1 className="text-3xl font-bold text-indigo-700">DAO Treasury</h1>
      <p>Simple steps to create a safe</p>
      <div className="pt-8 max-w-2xl">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Step 1: Add Owners
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Owners will be the addresses who will control this treasury
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-700"
            >
              Owner Address #1
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="first-name"
                id="first-name"
                autoComplete="given-name"
                className="p-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="sm:col-span-6">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-700"
            >
              Owner Address #2
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="first-name"
                id="first-name"
                autoComplete="given-name"
                className="p-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="sm:col-span-6 space-x-2">
            <button className="border border-indigo-600 px-4 rounded-md text-indigo-500 py-2">
              Cancel
            </button>
            <button
              onClick={createSafe}
              className="bg-indigo-600 px-4 rounded-md text-gray-50 py-2"
            >
              Create Safe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
