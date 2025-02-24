import { Inertia } from '@inertiajs/inertia';
import { Button, Typography, IconButton, Navbar, Collapse } from '@material-tailwind/react';

export function LoggedInNavbar({ openNav, setOpenNav }) {
    
  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
        <a href="/foods" className="flex items-center">
          เมนูอาหาร
        </a>
      </Typography>
      <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
        <a href="/status" className="flex items-center">
            สถานะการสั่งซื้อ
        </a>
      </Typography>
      <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
        <a href="/Food/Addtocart" className="flex items-center">
            ตะกร้าสินค้า
        </a>
      </Typography>
      <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
        <form onSubmit={(e) => { e.preventDefault(); Inertia.post('/logout'); }}>
          <Button type="submit" color="black" className="flex items-center text-white">
            ออกจากระบบ
          </Button>
        </form>
      </Typography>
    </ul>
  );

  return (
    <Navbar className="sticky top-0 z-10 w-full max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 mt-4">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography as="a" href="/foods" className="mr-4 cursor-pointer py-1.5 font-medium">
          อาหารปันสุข
        </Typography>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>
          <div className="flex items-center gap-x-1">
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg- lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </IconButton>
          </div>
        </div>
      </div>
      <Collapse open={openNav}>
        {navList}
      </Collapse>
    </Navbar>
  );
}
