export default function PolicyLayout({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
            {children}
        </div>
        </div>
    );
}
