export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
        </div>
    )
}