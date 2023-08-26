import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Divider, Image, Space } from 'antd';
import Button from '~/components/Button/Button';
import img from '~/assets/images/undraw_bug_fixing_oc7a.png';
import { useNavigate } from 'react-router-dom';

function ErrorFallback({ error, resetErrorBoundary }) {
    const navigate = useNavigate();
    return (
        <div style={{ textAlign: 'center' }}>
            <Space style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Image src={img} width={300} preview={false} />
                <h2>Có một ngoài sự cố xảy ra trên website</h2>
                <div>Đội kỹ thuật chúng tôi sẽ khắc phục sớm nhất có thể!</div>
                <span>Mong bạn thông cảm cho sự cố này, cảm ơn bạn rất nhiều!</span>
                <Divider />
                <Button
                    onClick={() => {
                        navigate('/');
                        window.location.reload();
                    }}
                >
                    Về trang chủ!
                </Button>
            </Space>
        </div>
    );
}

export default function MyErrorBoundary({ children }) {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                // reset state when error is recovered
            }}
        >
            {children}
        </ErrorBoundary>
    );
}
