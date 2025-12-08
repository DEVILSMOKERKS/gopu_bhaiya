'use client';

import React from 'react'
import Link from 'next/link'
import './MegaMenu.css'
import blousesImg from '../../assets/img/Collection/Collection1.jpg'
import plusSizeImg from '../../assets/img/Collection/Collection2.jpg'
import Image from 'next/image';

const MegaMenu = ({ activeCategory }) => {
  const menuData = {
    women: {
      category: [
        { name: "Shop All", link: "/shop?collection=women" },
        { name: "Blouses & Top", link: "/shop/blouses" },
        { name: "Pants", link: "/shop/pants" },
        { name: "Dresses & Jumpsuits", link: "/shop/dresses" },
        { name: "Outwear & Jackets", link: "/shop/outwear" },
        { name: "Pullovers", link: "/shop/pullovers" },
        { name: "Tees", link: "/shop/tees" },
        { name: "Shorts & Skirts", link: "/shop/shorts-skirts" }
      ],
      featured: [
        { name: "New In", link: "/shop/new" },
        { name: "MmbWeek", link: "/shop/mmbweek" },
        { name: "Plus Size", link: "/shop/plus-size" },
        { name: "Best Seller", link: "/shop/best-seller" }
      ],
      more: [
        { name: "Bundles", link: "/shop/bundles" },
        { name: "Occasion Wear", link: "/shop/occasion" },
        { name: "Matching Set", link: "/shop/matching-set" },
        { name: "Suiting", link: "/shop/suiting" }
      ],
      images: [
        { src: blousesImg, alt: "Blouses", title: "Blouses" },
        { src: plusSizeImg, alt: "Plus Size", title: "Plus Size" }
      ]
    },
    coordSet: {
      category: [
        { name: "Shop All", link: "/shop?collection=coord-set" },
        { name: "Casual Coord Sets", link: "/shop/coord-set/casual" },
        { name: "Formal Coord Sets", link: "/shop/coord-set/formal" },
        { name: "Party Coord Sets", link: "/shop/coord-set/party" },
        { name: "Wedding Coord Sets", link: "/shop/coord-set/wedding" },
        { name: "Office Coord Sets", link: "/shop/coord-set/office" },
        { name: "Designer Coord Sets", link: "/shop/coord-set/designer" },
        { name: "Traditional Coord Sets", link: "/shop/coord-set/traditional" }
      ],
      featured: [
        { name: "New In", link: "/shop/coord-set/new" },
        { name: "Best Seller", link: "/shop/coord-set/best-seller" },
        { name: "MmbWeek", link: "/shop/coord-set/mmbweek" },
        { name: "Limited Edition", link: "/shop/coord-set/limited" }
      ],
      more: [
        { name: "Accessories", link: "/shop/coord-set/accessories" },
        { name: "Matching Jewelry", link: "/shop/coord-set/jewelry" },
        { name: "Bags", link: "/shop/coord-set/bags" },
        { name: "Shoes", link: "/shop/coord-set/shoes" }
      ],
      images: [
        { src: blousesImg, alt: "Coord Sets", title: "Coord Sets" },
        { src: plusSizeImg, alt: "Party Wear", title: "Party Wear" }
      ]
    },
    kurti: {
      category: [
        { name: "Shop All", link: "/shop?collection=kurti" },
        { name: "Cotton Kurtis", link: "/shop/kurti/cotton" },
        { name: "Silk Kurtis", link: "/shop/kurti/silk" },
        { name: "Chiffon Kurtis", link: "/shop/kurti/chiffon" },
        { name: "Linen Kurtis", link: "/shop/kurti/linen" },
        { name: "Georgette Kurtis", link: "/shop/kurti/georgette" },
        { name: "Party Kurtis", link: "/shop/kurti/party" },
        { name: "Casual Kurtis", link: "/shop/kurti/casual" }
      ],
      featured: [
        { name: "New In", link: "/shop/kurti/new" },
        { name: "Best Seller", link: "/shop/kurti/best-seller" },
        { name: "MmbWeek", link: "/shop/kurti/mmbweek" },
        { name: "Plus Size", link: "/shop/kurti/plus-size" }
      ],
      more: [
        { name: "Designer Kurtis", link: "/shop/kurti/designer" },
        { name: "Traditional Kurtis", link: "/shop/kurti/traditional" },
        { name: "Modern Kurtis", link: "/shop/kurti/modern" },
        { name: "Embroidered Kurtis", link: "/shop/kurti/embroidered" }
      ],
      images: [
        { src: blousesImg, alt: "Kurtis", title: "Kurtis" },
        { src: plusSizeImg, alt: "Party Kurtis", title: "Party Kurtis" }
      ]
    },
    shirts: {
      category: [
        { name: "Shop All", link: "/shop?collection=shirts" },
        { name: "Formal Shirts", link: "/shop/shirts/formal" },
        { name: "Casual Shirts", link: "/shop/shirts/casual" },
        { name: "Polo Shirts", link: "/shop/shirts/polo" },
        { name: "Dress Shirts", link: "/shop/shirts/dress" },
        { name: "Oxford Shirts", link: "/shop/shirts/oxford" },
        { name: "Flannel Shirts", link: "/shop/shirts/flannel" },
        { name: "Denim Shirts", link: "/shop/shirts/denim" }
      ],
      featured: [
        { name: "New In", link: "/shop/shirts/new" },
        { name: "Best Seller", link: "/shop/shirts/best-seller" },
        { name: "MmbWeek", link: "/shop/shirts/mmbweek" },
        { name: "Premium Collection", link: "/shop/shirts/premium" }
      ],
      more: [
        { name: "Designer Shirts", link: "/shop/shirts/designer" },
        { name: "Printed Shirts", link: "/shop/shirts/printed" },
        { name: "Solid Shirts", link: "/shop/shirts/solid" },
        { name: "Striped Shirts", link: "/shop/shirts/striped" }
      ],
      images: [
        { src: blousesImg, alt: "Shirts", title: "Shirts" },
        { src: plusSizeImg, alt: "Formal Shirts", title: "Formal Shirts" }
      ]
    }
  }

  const currentData = menuData[activeCategory] || menuData.women

  return (
    <div className="megamenu-mega-menu show">
      <div className="megamenu-mega-menu-container">
        {/* Left side - Text columns */}
        <div className="megamenu-mega-menu-content">
          <div className="megamenu-mega-menu-column">
            <h3 className="megamenu-mega-menu-heading">Category</h3>
            <ul className="megamenu-mega-menu-list">
              {currentData.category.map((item, index) => (
                <li key={index}>
                  <Link to={item.link} className="megamenu-mega-menu-link">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="megamenu-mega-menu-column">
            <h3 className="megamenu-mega-menu-heading">Featured</h3>
            <ul className="megamenu-mega-menu-list">
              {currentData.featured.map((item, index) => (
                <li key={index}>
                  <Link to={item.link} className="megamenu-mega-menu-link">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="megamenu-mega-menu-column">
            <h3 className="megamenu-mega-menu-heading">More</h3>
            <ul className="megamenu-mega-menu-list">
              {currentData.more.map((item, index) => (
                <li key={index}>
                  <Link to={item.link} className="megamenu-mega-menu-link">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right side - Product images */}
        <div className="megamenu-mega-menu-images">
          {currentData.images.map((image, index) => (
            <div key={index} className="megamenu-mega-menu-image-container">
              <Image
                src={image.src}
                alt={image.alt}
                className="megamenu-mega-menu-image"
              />
              <p className="megamenu-mega-menu-image-title">{image.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MegaMenu
