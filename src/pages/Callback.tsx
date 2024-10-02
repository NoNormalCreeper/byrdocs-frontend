import Loading from '@/assets/loading.svg'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function LoadingIcon() {
    return (
        <img src={Loading} alt="loading" className="animate-spin w-20 h-20 mx-auto" />
    )
}

function SuccessIcon() {
    return (
        <svg
            className="mx-auto h-24 w-24 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M5 13l4 4L19 7"
            ></path>
        </svg>
    )
}

function ErrorIcon() {
    return (
        <svg
            className="mx-auto h-24 w-24 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M6 18L18 6M6 6l12 12"
            ></path>
        </svg>
    )
}

export default function About() {
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        if (!query.get('code') || !query.get('state')) {
            setError('参数错误，请重试');
            return;
        }
        fetch('/api/callback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: query.get('code'),
                state: query.get('state'),
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.token) {
                    setToken(res.token);
                } else {
                    setError(res.error);
                }
            })
            .catch((err) => {
                setError(err.toString());
            })
    }, [location.search]);

    return (
        <>
            <div className="md:w-[800px] w-full md:m-auto px-10 flex flex-col pt-12">
                <div className="w-full m-auto">
                    <img src="/logo_512.png" alt="logo" className="w-24 h-24 mx-auto" />
                    <div className="text-center mb-8 text-2xl md:text-3xl font-bold" style={{ lineHeight: 3 }}>
                        登录 <code>byrdocs-cli</code>
                    </div>
                    {error ? (
                        <div className="space-y-3 text-xl">
                            <ErrorIcon />
                            <div className='text-center text-red-500 font-bold'>
                                {error}
                            </div>
                        </div>

                    ) : (
                        <div className="space-y-3 text-xl">
                            {token ? (
                                <>
                                    <SuccessIcon />
                                    <div className='text-center text-green-500 font-bold'>
                                        登录成功！
                                    </div>
                                    <div className='text-center text-green-500 font-bold'>
                                        Token: {token}
                                    </div>
                                </>
                            ) : <LoadingIcon />}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}