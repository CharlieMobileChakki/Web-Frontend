import React from "react";

import img1 from "../../assets/blog/1.jpeg"
import img2 from "../../assets/blog/2.jpeg"
import img3 from "../../assets/blog/3.jpeg"
import img4 from "../../assets/blog/4.jpeg"
import img5 from "../../assets/blog/5.jpeg"
import img6 from "../../assets/blog/6.jpeg"
import img7 from "../../assets/blog/7.jpeg"
import img8 from "../../assets/blog/8.jpeg"
import img9 from "../../assets/blog/9.jpeg"
import img10 from "../../assets/blog/10.jpeg"
import img13 from "../../assets/blog/13.jpeg"
import img11 from "../../assets/blog/11.jpeg"
import img12 from "../../assets/blog/12.jpeg"

import { BannerSection } from "../../components/user/BannerSection";
import Bg from "../../assets/Banner/S1.png";




const Blog = () => {




    const blogPosts = [

        {
            id: 1,
            title: "Eat Right Milets Mela",
            excerpt:
                "Discover the goodness of freshly ground, stone-milled flour and why it’s healthier than packaged alternatives. Freshly milled millets retain natural nutrients and taste better.",
            image: img13,
            date: "June 29, 2024",
            author: "Mobile Chakki Team",
        },
        {
            id: 2,
            title: "Eat Right Milets Mela",
            excerpt:
                "They also support a wholesome lifestyle. With Mobile Chakki, you can enjoy the perfect blend of nutrition, freshness, and convenience—right in your kitchen.",
            image: img11,
            date: "June 29, 2024",
            author: "Mobile Chakki Team",
        },
        {
            id: 3,
            title: "Milets by : Khader Vali",
            excerpt:
                "Known as the Millet Man of India, Dr. Khader Vali highlighted the health benefits of organic millets. His insights encouraged families to embrace nutrition and wellness in daily life.",
            image: img10,
            date: "August 25, 2025",
            author: "Mobile Chakki Team",
        },
        {
            id: 4,
            title: "Milets by : Khader Vali",
            excerpt:
                "We uphold the highest quality and safety standards, from ISO certifications to FDA approvals. Every Mobile Chakki delivery is trusted, safe, and reliable.",
            image: img7,
            date: "August 25, 2025",
            author: "Mobile Chakki Team",
        },
        {
            id: 5,
            title: "Milets by : Khader Vali",
            excerpt:
                "Certified for excellence with ISO and FDA standards, we ensure complete quality and safety. Mobile Chakki brings you purity and trust with every order.",
            image: img6,
            date: "August 25, 2025",
            author: "Mobile Chakki Team",
        },
        {
            id: 6,
            title: "Sahakar Masala Mela",
            excerpt:
                "Experience the richness of freshly ground spices at the Sahakar Masala Mela. Discover authentic flavors that bring health and taste to your kitchen.",
            image: img1,
            date: "May , 2025",
            author: "Mobile Chakki Team",
        },
        {
            id: 7,
            title: "Sahakar Masala Mela",
            excerpt:
                "From farm-fresh ingredients to stone-ground spices, Sahakar Masala Mela celebrates purity, aroma, and tradition in every blend.",
            image: img2,
            date: "May , 2025",
            author: "Mobile Chakki Team",
        },
        {
            id: 8,
            title: "Sahakar Masala Mela",
            excerpt:
                "Discover how natural spices enhance wellness and taste at the Sahakar Masala Mela. Freshness and authenticity you can trust.",
            image: img3,
            date: "May , 2025",
            author: "Mobile Chakki Team",
        },
        {
            id: 10,
            title: "Sahakar Masala Mela",
            excerpt:
                "Celebrate tradition and flavor with freshly ground masalas. Sahakar Masala Mela brings you closer to authentic Indian kitchens.",
            image: img4,
            date: "May, 2025",
            author: "Mobile Chakki Team",
        },
        {
            id: 11,
            title: "Sahakar Masala Mela",
            excerpt:
                "Pure, natural, and aromatic—Sahakar Masala Mela is where freshness meets health. Taste the difference of Mobile Chakki spices.",
            image: img5,
            date: "May , 2025",
            author: "Mobile Chakki Team",
        },
        {
            id: 12,
            title: "How Mobile Chakki Ensures Quality",
            excerpt:
                "From ISO certifications to FDA approval, learn how we maintain the highest quality & safety standards in every delivery.",
            image: img8,
            date: "August 25, 2025",
            author: "Mobile Chakki Team",
        },


    ];


    return (

        <>
            <BannerSection
                title="Blog"
                subtitle="Doorstep grinding & organic food delivery for a healthier tomorrow"
                bgImage={Bg}
                className="bg-left-bottom"
            />
            <section className="container mx-auto px-4 md:px-1 py-12">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-[#7a5410]">Our Blog</h1>
                    <p className="mt-2 text-gray-600">
                        Stay updated with health tips, organic food insights, and the latest
                        from Mobile Chakki.
                    </p>
                </div>



                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {blogPosts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
                        >
                            {/* Image */}
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-48 object-cover"
                            />

                            {/* Content */}
                            <div className="p-6 text-left">
                                <p className="text-sm text-gray-500 mb-1">
                                    {post.date} • {post.author}
                                </p>
                                <h3 className="text-lg font-semibold text-[#7a5410] mb-2">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                                {/* <a

                            
                                href="#"
                                className="text-[#DA352D] font-medium hover:underline"
                            >
                                Read More →
                            </a> */}
                            </div>
                        </div>
                    ))}
                </div>
            </section>


        </>
    );
};

export default Blog;
