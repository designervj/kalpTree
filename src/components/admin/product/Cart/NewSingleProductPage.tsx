import React, { useEffect, useMemo, useState } from 'react'
import { ProductModel } from '../type/ProductModel';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import { FilterAttributeModal } from '@/components/categoryPage/CategoryPage';
import { getSignglePageHtml } from './util/GetSignglePageHtml';

type Props = {
    slug: string
    onPushToCanvas: (html: string) => void
}
const NewSingleProductPage = ({ slug, onPushToCanvas }: Props) => {
    //const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);
    const params = useParams();
    const productId = slug ? slug : params.slug;


    const {
        listProduct: products,
        isProductLoading,
        cart,
        isCartLoading,
    } = useSelector((state: RootState) => state.product);

    const selectedProduct = useMemo(() => {
        return products.find((product) => product?._id === productId);
    }, [products, productId])
    console.log("selectedProduct", selectedProduct)
    // Products that belong to this category
    const categoryProducts = [selectedProduct]

    const filterAttributes = useMemo((): FilterAttributeModal => {
        const data: FilterAttributeModal = {};
        categoryProducts.forEach((product) => {
            (product?.variants ?? []).forEach((variant) => {
                (variant.attributes ?? []).forEach((attribute) => {
                    const key = attribute.attributeName;
                    const value = attribute.value;
                    if (key && value) {
                        if (data[key]) {
                            if (!data[key].includes(value)) data[key].push(value);
                        } else {
                            data[key] = [value];
                        }
                    }
                });
            });
        });
        return data;
    }, [categoryProducts]);


    const GetSinglePageHtml = useMemo(() => {
        if (!selectedProduct) return "";
        return getSignglePageHtml(selectedProduct)
    }, [selectedProduct])

    
    const handlePushCategoryToCanvas = () => {
        onPushToCanvas(GetSinglePageHtml)
    }
    return (
        <>
            <div className="flex-1 min-w-0 overflow-auto bg-white relative">
                <div
                    style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                        background: "#1e293b",
                        padding: "8px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                    }}
                >
                    <span style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 600 }}>
                        Product Preview: <em style={{ fontWeight: 400 }}>{"Single Product"}</em>
                    </span>
                    <button
                          onClick={handlePushCategoryToCanvas}
                        style={{
                            background: "#6d28d9",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "6px 14px",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            letterSpacing: "0.04em",
                        }}
                    >
                        ↩ Push to Canvas
                    </button>
                </div>
                {GetSinglePageHtml && (
                    <iframe
                        title="Product Preview"
                        srcDoc={GetSinglePageHtml}
                        style={{
                            width: '100%',
                            minHeight: '100vh',
                            border: 'none',
                        }}
                    />
                )}
            </div>
        </>
    )
}

export default NewSingleProductPage