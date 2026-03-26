<template>
    <footer class="bg-black text-white mt-20">

        <div class="mr-6 pl-10 pr-10 border-t">
            
        <!-- NEWSLETTER SIGNUP -->
        <section class=" max-w-10xl mx-auto pl-10 pr-10 py-12">
           
            <div class="container mx-auto text-center px-4">
                <h3 class="text-xl font-bold">Don’t Miss Updates & Offers</h3>
                <p class="text-gray-600 mt-2 mb-6">Subscribe to our newsletter for the best deals and latest
                    products</p>
                <div class="flex justify-center gap-2">
                    <input type="email" placeholder="Enter your email" class="border-none px-4 w-full max-w-md rounded-full text-black focus:outline-none 
                    focus:shadow-[0_0_10px_white] " />
                    <button class="bg-white text-black px-4 py-2 rounded-full hover:shadow-[0_0_10px_white]">Subscribe</button>
                </div>
            </div>
        </section>
            <!-- TOP SECTION -->
            <div class=" border-t 
            max-w-10xl mx-auto px-6 py-6 flex grid grid-cols-1 md:grid-cols-4 gap-10>
            ">

                <!-- CONTACT -->
                <div>
                    <h3 class="font-semibold text-xl mb-4">Contact</h3>
                    <div class="space-y-4">
                        <p class="text-sm text-gray-100">1-866-HOOKAHS (466-5247)</p>
                        <p class="text-sm text-gray-100">support@hookah.com</p>
                    </div>
                </div>

                <!-- SHOP -->
                <div>
                    <h3 class="font-semibold text-xl mb-4">Shop</h3>
                    <ul class="space-y-4 text-sm text-gray-100 ">
                        <li >
                            <NuxtLink to="/products"  class="hover:underline hover:text-yellow-500">Hookahs</NuxtLink>
                        </li>
                        <li >
                            <NuxtLink to="/products"  class="hover:underline hover:text-yellow-500">Shisha Tobacco</NuxtLink>
                        </li>
                        <li class="hover:text-yellow-500 hover:underline">
                            <NuxtLink to="/products"  class="hover:underline hover:text-yellow-500">Charcoal</NuxtLink>
                        </li>
                        <li class="hover:text-yellow-500 hover:underline">
                            <NuxtLink to="/products"  class="hover:underline hover:text-yellow-500">Hookah Accessories</NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- ABOUT -->
                <div>
                    <h3 class="font-semibold text-xl mb-4">About</h3>
                    <ul class="space-y-4 text-sm text-gray-100">
                        <li >
                            <NuxtLink to="#"  class="hover:underline hover:text-yellow-500">About Us</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="#"  class="hover:underline hover:text-yellow-500">Blog</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="#"  class="hover:underline hover:text-yellow-500">FAQs</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="#"  class="hover:underline hover:text-yellow-500">Rewards Program</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="#"  class="hover:underline hover:text-yellow-500">Refer a Friend</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="#"  class="hover:underline hover:text-yellow-500">Business Opportunities</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="#"  class="hover:underline hover:text-yellow-500">Coupon Codes</NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- SUPPORT -->
                <div>
                    <h3 class="font-semibold text-xl mb-4">Support</h3>
                    <ul class="space-y-4 text-sm text-gray-100">
                        <li>
                            <NuxtLink to="#"  class="hover:underline hover:text-yellow-500">Contact Us</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="#"  class="hover:underline hover:text-yellow-500" >My Orders</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="#"  class="hover:underline hover:text-yellow-500">Shipping & Returns</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="#"  class="hover:underline hover:text-yellow-500">Accessibility</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="#"  class="hover:underline hover:text-yellow-500">Terms & Conditions</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="#"  class="hover:underline hover:text-yellow-500">Privacy Policy</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="#"  class="hover:underline hover:text-yellow-500">Cookies Policy</NuxtLink>
                        </li>
                    </ul>
                </div>

            </div>

            <!-- PAYMENT + SECURITY -->
            <div class="border-t">
                <div class="max-w-10xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

                    <p class="text-gray-300 text-sm">
                        100% Secure Payment
                    </p>

                    <!-- PAYMENT ICONS -->
                    <div class="flex gap-4 text-sm text-gray-300">
                        <span>Visa</span>
                        <span>MasterCard</span>
                        <span>American Express</span>
                        <span>Discover</span>
                        <span>SSL Secure</span>
                    </div>

                </div>
            </div>

            <!-- BOTTOM -->
            <div>
                <div class=" max-w-10xl  mx-auto px-6 py-6 text-center text-sm text-gray-500 space-y-2">
                    <div class="flex flex-wrap justify-center items-center gap-4">
                        <p>© Hookah Digital Services INC, 2026</p>
                        <p>3525 Whitehall Park Drive, Suite 300, Charlotte, NC 28273</p>
                        <p>Tel. 1-866-HOOKAHS (866) 466-5247</p>
                    </div>
                </div>
            </div>
        </div>

    </footer>
</template>