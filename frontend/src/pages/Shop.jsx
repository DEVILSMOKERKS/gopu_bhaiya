// import React, { useState } from 'react';
// import { Heart, Plus } from 'lucide-react';
// import bannerImg from '../assets/img/shopp.jpg';
// import './Shop.css';


// function Shop() {
//     const [wishlist, setWishlist] = useState(new Set());
//     const [expandedFilters, setExpandedFilters] = useState(new Set());

//     // Remove duplicate product IDs to resolve the issue
//     const products = [
//         {
//             id: 1,
//             image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400",
//             title: "Chill Wrap Top",
//             subtitle: "Turn It Up Top",
//             price: 160,
//             colors: ['#8B4513'],
//             isNew: false
//         },
//         {
//             id: 2,
//             image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
//             title: "Essential T-Shirt",
//             subtitle: "Turn It Up T-Shirt",
//             price: 95,
//             colors: ['#2C3E50', '#5DADE2', '#58D68D'],
//             isNew: true
//         },
//         {
//             id: 3,
//             image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400",
//             title: "Chill Wrap Top",
//             subtitle: "Turn It Up Top",
//             price: 160,
//             colors: ['#8B4513'],
//             isNew: false
//         },
//         {
//           id: 4,
//           image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400",
//           title: "Chill Wrap Top",
//           subtitle: "Turn It Up Top",
//           price: 160,
//           colors: ['#8B4513'],
//           isNew: false
//       },
        
//         {
//             id: 5,
//             image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
//             title: "Essential T-Shirt",
//             subtitle: "Turn It Up T-Shirt",
//             price: 95,
//             colors: ['#2C3E50', '#5DADE2', '#58D68D'],
//             isNew: true
//         },
//         {
//             id: 6,
//             image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400",
//             title: "Chill Wrap Top",
//             subtitle: "Turn It Up Top",
//             price: 160,
//             colors: ['#8B4513'],
//             isNew: false
//         }
//     ];

//     const filterOptions = [
//         'Sort By',
//         'Size',
//         'Color',
//         'Collection',
//         'Fabric'
//     ];

//     const toggleWishlist = (productId) => {
//         const newWishlist = new Set(wishlist);
//         if (newWishlist.has(productId)) {
//             newWishlist.delete(productId);
//         } else {
//             newWishlist.add(productId);
//         }
//         setWishlist(newWishlist);
//     };

//     const toggleFilter = (filter) => {
//         const newExpandedFilters = new Set(expandedFilters);
//         if (newExpandedFilters.has(filter)) {
//             newExpandedFilters.delete(filter);
//         } else {
//             newExpandedFilters.add(filter);
//         }
//         setExpandedFilters(newExpandedFilters);
//     };

//     return (
//         <div className="shop-fashionShowcaseMain">

//             {/* banner */}
//             <div className="shop-bannerContainer">
//                 <img src={bannerImg} alt="banner-img" width='100%' height='100%' className="shop-banner" />
//             </div>

//             <div className="shop-filterAndProductContainer">
//                 {/* Filter Sidebar */}
//                 <div className="shop-filterSidebarContainer">
//                     <h2 className="shop-filterSidebarTitle">Filters</h2>
//                     <div className="shop-filterOptionsContainer">
//                         {filterOptions.map((filter) => (
//                             <div key={filter} className="shop-filterOptionItem">
//                                 <button
//                                     className="shop-filterOptionButton"
//                                     onClick={() => toggleFilter(filter)}
//                                 >
//                                     <span className="shop-filterOptionText">{filter}</span>
//                                     <Plus
//                                         className={`shop-filterOptionIcon ${expandedFilters.has(filter) ? 'shop-filterOptionIconRotated' : ''}`}
//                                         size={16}
//                                     />
//                                 </button>
//                                 {expandedFilters.has(filter) && (
//                                     <div className="shop-filterOptionContent">
//                                         <div className="shop-filterOptionPlaceholder">
//                                             Filter options for {filter}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Product Grid */}
//                 <div className="shop-productShowcaseContainer">
//                     <div className="shop-productGrid">
//                         {products.map((product) => (
//                             <div key={product.id} className="shop-productCard">
//                                 <div className="shop-imageContainer">
//                                     <img
//                                         src={product.image}
//                                         alt={product.title}
//                                         className="shop-productImage"
//                                     />
//                                     {product.isNew && (
//                                         <div className="shop-newBadge">
//                                             <span className="shop-newText">New</span>
//                                         </div>
//                                     )}
//                                     <button
//                                         className="shop-wishlistButton"
//                                         onClick={() => toggleWishlist(product.id)}
//                                         aria-label="Add to wishlist"
//                                     >
//                                         <Heart
//                                             className={`shop-heartIcon ${wishlist.has(product.id) ? 'shop-heartFilled' : ''}`}
//                                             size={16}
//                                         />
//                                     </button>
//                                 </div>

//                                 <div className="shop-productInfo">
//                                     <h3 className="shop-productTitle">{product.title}</h3>
//                                     <p className="shop-productSubtitle">{product.subtitle}</p>
//                                     <div className="shop-priceAndColors">
//                                         <span className="shop-productPrice">${product.price}</span>
//                                         <div className="shop-colorOptions">
//                                             {product.colors.map((color, index) => (
//                                                 <div
//                                                     key={index}
//                                                     className="shop-colorDot"
//                                                     style={{ backgroundColor: color }}
//                                                     aria-label={`Color option ${index + 1}`}
//                                                 />
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Shop;
