export const Footer = () => {
    return (
        <footer className="bg-white text-gray-500 py-8">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <nav className="mb-4 md:mb-0 space-x-6">
                    <a href="/welcome" className="text-sm text-gray-500 hover:text-black transition-colors duration-300">หน้าหลัก</a>
                    <a href="/foods" className="text-sm text-gray-500 hover:text-black transition-colors duration-300">เกี่ยวกับ</a>
                    <a href="/welcome" className="text-sm text-gray-500 hover:text-black transition-colors duration-300">ติดต่อ</a>
                </nav>
                <div className="text-sm text-gray-400 text-center md:text-right">
                    <p>© 2024 ร่วมพัฒนาโดย:</p>
                    <ul className="list-none space-y-1">
                        <li>ธนพัทร บุญผัด | 6604101330, ธนภัทร ตาสาย | 6604101331</li>
                        <li>พงศกร ทนานนท์ | 6604101353, ศุปวิทย์ วงศ์สุภา | 6604101384 </li>
                    </ul>
                    <p className="mt-2">วิทยาการคอมพิวเตอร์ | มหาวิทยาลัยแม่โจ้ All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
