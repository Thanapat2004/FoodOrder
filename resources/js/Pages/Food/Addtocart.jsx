import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import '@fontsource/noto-sans-thai';

export default function Addtocart({ paymentMethods }) {
    const [cart, setCart] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState('');

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(savedCart);
    }, []);

    const handleRemoveFromCart = (foodId) => {
        const updatedCart = cart.filter((food) => food.id !== foodId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleIncreaseQuantity = (foodId) => {
        const updatedCart = cart.map((food) => 
            food.id === foodId ? { ...food, quantity: (food.quantity || 1) + 1 } : food
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleDecreaseQuantity = (foodId) => {
        const updatedCart = cart.map((food) => 
            food.id === foodId && (food.quantity || 1) > 1 
                ? { ...food, quantity: (food.quantity || 1) - 1 } 
                : food
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handlePaymentChange = (e) => {
        setSelectedPayment(e.target.value);
    };

    const handleSubmitOrder = () => {
        const orderData = {
            cart: cart.map(food => ({
                id: food.id,
                quantity: food.quantity || 1
            })),
            payment_method: selectedPayment
        };

        Inertia.post(route('orders.store'), orderData, {
            onSuccess: () => {
                alert("สั่งซื้อสำเร็จ!");
                localStorage.removeItem('cart');
                setCart([]);
                setSelectedPayment('');
            },
            onError: (errors) => {
                console.error(errors);
            }
        });
    };

    const totalPrice = cart.reduce((total, food) => total + (food.price * (food.quantity || 1)), 0);

    return (
        <AuthenticatedLayout>
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">ตะกร้าสินค้า</h1>
            {cart.length > 0 ? (
                cart.map((food) => (
                    <div key={food.id} className="border rounded-lg p-4 shadow-lg mb-4">
                        <h2 className="text-xl font-semibold mb-2">{food.name}</h2>
                        <p className="text-gray-600 mb-2">{food.description}</p>
                        <p className="text-green-500 font-bold mb-4">THB: {food.price} ฿</p>
                        <div className="flex items-center gap-2 mb-4">
                            <button 
                                onClick={() => handleDecreaseQuantity(food.id)} 
                                className="bg-gray-300 px-3 py-1 rounded-lg hover:bg-gray-400">
                                -
                            </button>
                            <span className="text-lg">{food.quantity || 1}</span>
                            <button 
                                onClick={() => handleIncreaseQuantity(food.id)} 
                                className="bg-gray-300 px-3 py-1 rounded-lg hover:bg-gray-400">
                                +
                            </button>
                        </div>
                        <button 
                            onClick={() => handleRemoveFromCart(food.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                            ลบออกจากตะกร้า
                        </button>
                    </div>
                ))
            ) : (
                <p>ไม่มีสินค้าในตะกร้า</p>
            )}
            <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">ยอดรวม: {totalPrice} ฿</h2>
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">เลือกวิธีการชำระเงิน:</label>
                    <select 
                        value={selectedPayment} 
                        onChange={handlePaymentChange} 
                        className="border p-2 rounded-lg w-full"
                    >
                        <option value="">-- กรุณาเลือกวิธีการชำระเงิน --</option>
{Array.isArray(paymentMethods) && paymentMethods.map((payment) => (
    <option key={payment.id} value={payment.id}>
        {payment.name} {/* เปลี่ยนจาก payment.method_name เป็น payment.name */}
    </option>
))}
                    </select>
                </div>
                <Link href="/foods" className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 mr-4">
                    กลับไปเลือกสินค้า
                </Link>
                <button 
                    onClick={handleSubmitOrder}
                    className={`px-4 py-2 rounded-lg ${cart.length > 0 && selectedPayment ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                    disabled={cart.length === 0 || !selectedPayment}
                >
                    ยืนยันการสั่งซื้อ
                </button>
            </div>
        </div>
        </AuthenticatedLayout>
    );
}
