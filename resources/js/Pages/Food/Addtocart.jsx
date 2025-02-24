import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import { LoggedInNavbar } from "@/Components/LoggedInNavbar";
import { Footer } from "@/Components/Footer";
import '@fontsource/noto-sans-thai';

export default function Addtocart({ paymentMethods }) {
    const [cart, setCart] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [userAddress, setUserAddress] = useState({ name: '', phone: '', address: '', additionalDetails: '' });

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const storedAddress = JSON.parse(localStorage.getItem('userAddress')) || { name: '', phone: '', address: '', additionalDetails: '' };

        setCart(storedCart);
        setUserAddress(storedAddress);

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const loggedInUser = document.querySelector('meta[name="user-id"]')?.content;

        if (loggedInUser && currentUser !== loggedInUser) {
            localStorage.removeItem('cart');
            localStorage.removeItem('userAddress');
            localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
            setCart([]);
            setUserAddress({ name: '', phone: '', address: '', additionalDetails: '' });
        }
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

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setUserAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitOrder = () => {
        if (!userAddress.name || !userAddress.phone || !userAddress.address) {
            alert("กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน");
            return;
        }

        const orderData = {
            cart: cart.map(food => ({
                id: food.id,
                quantity: food.quantity || 1
            })),
            payment_method: selectedPayment,
            user_address: userAddress
        };

        Inertia.post(route('orders.store'), orderData, {
            preserveState: false,
            preserveScroll: true,
            onSuccess: () => {
                alert("สั่งซื้อสำเร็จ!");
                localStorage.removeItem('cart');
                localStorage.removeItem('userAddress');
                setCart([]);
                setSelectedPayment('');
                setUserAddress({ name: '', phone: '', address: '', additionalDetails: '' });
            },
            onError: (errors) => {
                console.error(errors);
            }
        });
    };

    const totalPrice = cart.reduce((total, food) => total + (food.price * (food.quantity || 1)), 0);

    return (
        <div className="container mx-auto p-6 md-auto">
            <LoggedInNavbar/>
            <h1 className="text-3xl font-bold mb-4 mt-10">ตะกร้าสินค้า</h1>
            {cart.length > 0 ? (
                cart.map((food) => (
                    <div key={food.id} className="border rounded-lg p-4 shadow-lg mb-4 flex items-center gap-4">
                        <img 
                            src={`/storage/${food.image}`} 
                            alt={food.name} 
                            className="w-24 h-24 object-cover rounded-lg" 
                        />
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold mb-2">{food.name}</h2>
                            <p className="text-gray-600 mb-2">{food.description}</p>
                            <p className="text-green-500 font-bold mb-4">THB: {food.price} ฿</p>
                            <div className="flex items-center gap-2 mb-4">
                                <button onClick={() => handleDecreaseQuantity(food.id)} className="bg-gray-300 px-3 py-1 rounded-lg hover:bg-gray-400">-</button>
                                <span className="text-lg">{food.quantity || 1}</span>
                                <button onClick={() => handleIncreaseQuantity(food.id)} className="bg-gray-300 px-3 py-1 rounded-lg hover:bg-gray-400">+</button>
                            </div>
                            <button onClick={() => handleRemoveFromCart(food.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">ลบออกจากตะกร้า</button>
                        </div>
                    </div>
                ))
            ) : (
                <p>ไม่มีสินค้าในตะกร้า</p>
            )}

            <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">ยอดรวม: {totalPrice} ฿</h2>

                <div className="mb-6 border rounded-lg p-4 shadow">
                    <h3 className="text-xl font-semibold mb-4">ข้อมูลการจัดส่ง</h3>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">ชื่อ-นามสกุล:</label>
                        <input type="text" name="name" value={userAddress.name} onChange={handleAddressChange} className="border p-2 rounded-lg w-full" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">เบอร์โทรศัพท์:</label>
                        <input type="text" name="phone" value={userAddress.phone} onChange={handleAddressChange} className="border p-2 rounded-lg w-full" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">ที่อยู่จัดส่ง:</label>
                        <textarea name="address" value={userAddress.address} onChange={handleAddressChange} className="border p-2 rounded-lg w-full" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">รายละเอียดเพิ่มเติม:</label>
                        <textarea name="additionalDetails" value={userAddress.additionalDetails} onChange={handleAddressChange} className="border p-2 rounded-lg w-full" />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-semibold">เลือกวิธีการชำระเงิน:</label>
                    <select value={selectedPayment} onChange={handlePaymentChange} className="border p-2 rounded-lg w-full">
                        <option value="">-- กรุณาเลือกวิธีการชำระเงิน --</option>
                        {Array.isArray(paymentMethods) && paymentMethods.map((payment) => (
                            <option key={payment.id} value={payment.id}>{payment.name}</option>
                        ))}
                    </select>
                </div>

                <Link href="/foods" className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 mr-4">กลับไปเลือกสินค้า</Link>
                <button onClick={handleSubmitOrder} className={`px-4 py-2 rounded-lg ${cart.length > 0 && selectedPayment ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`} disabled={cart.length === 0 || !selectedPayment}>ยืนยันการสั่งซื้อ</button>
            </div>

            <div className="mt-10">
                <Footer/>
            </div>
        </div>
    );
}
