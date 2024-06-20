'use client';

export default function ErrorDisplay( {err, setErr} ) {
    return (
        <div className={err.error ? 'fixed w-screen h-screen top-0 left-0 bg-black/[.6] z-40' : 'hidden'}>
            <div className="absolute flex flex-col justify-center text-center rounded-lg m-auto left-0 right-0 bottom-0 top-0 w-96 h-32 z-50 text-wrap opacity-100 bg-white">
                <p>ERROR:</p>
                <p>{err.message}</p>
                <button onClick={() => setErr({error: false, message: ''})}>OK</button>
            </div>
        </div>
    )
}