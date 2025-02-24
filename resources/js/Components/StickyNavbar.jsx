import { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Button, Typography, IconButton, Navbar,  } from '@material-tailwind/react';
import { Link } from '@inertiajs/react';

export function StickyNavbar() {
  const [openNav, setOpenNav] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (Inertia.page && Inertia.page.props.auth) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [Inertia.page]);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
        <a href="/foods" className="flex items-center">
          เมนูอาหาร
        </a>
      </Typography>
      {isLoggedIn && (
        <Typography as="li" variant="small" color="blue-gray" className="p-1 font-normal">
          <form onSubmit={(e) => { e.preventDefault(); Inertia.post('/logout'); }}>
            <Button type="submit" variant="text" className="flex items-center">
              Log Out
            </Button>
          </form>
        </Typography>
      )}
    </ul>
  );

  return (
    <div className="max-w-full w-full overflow-x-hidden">
      <Navbar className="sticky top-0 z-10 w-full max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography as="a" href="#" className="mr-4 cursor-pointer py-1.5 font-medium">
            อาหารปันสุข
          </Typography>
          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{navList}</div>
            <div className="flex items-center gap-x-1">
              {!isLoggedIn ? (
                <>
                  <Link href="/login">
                    <Button variant="text" size="sm" className="hidden lg:inline-block">
                      <span>เข้าสู่ระบบ</span>
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="gradient" size="sm" className="hidden lg:inline-block">
                      <span>สมัคร</span>
                    </Button>
                  </Link>
                </>
              ) : (
                <></>
              )}
            </div>
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
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
        <Collapse open={openNav}>
          {navList}
        </Collapse>
      </Navbar>
    </div>
  );
}
