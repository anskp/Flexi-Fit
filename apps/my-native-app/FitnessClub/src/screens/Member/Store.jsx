import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const Store = () => {
  const [activeTab, setActiveTab] = useState('shop');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventCategory, setSelectedEventCategory] = useState('all');
  const [selectedEventLocation, setSelectedEventLocation] = useState('all');

  const tabs = [
    { id: 'shop', title: 'Shop', icon: '🛍️' },
    { id: 'events', title: 'Events', icon: '🎫' },
  ];

  const products = [
    {
      id: 1,
      name: "Premium Protein Powder",
      price: "₹1,299",
      originalPrice: "₹1,599",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      category: "Supplements",
      rating: 4.5,
      reviews: 128,
      discount: "20% OFF"
    },
    {
      id: 2,
      name: "Fitness Tracker Watch",
      price: "₹2,499",
      originalPrice: "₹3,299",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      category: "Electronics",
      rating: 4.3,
      reviews: 89,
      discount: "25% OFF"
    },
    {
      id: 3,
      name: "Yoga Mat Premium",
      price: "₹899",
      originalPrice: "₹1,199",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      category: "Equipment",
      rating: 4.7,
      reviews: 256,
      discount: "30% OFF"
    },
    {
      id: 4,
      name: "Resistance Bands Set",
      price: "₹599",
      originalPrice: "₹799",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      category: "Equipment",
      rating: 4.4,
      reviews: 167,
      discount: "15% OFF"
    }
  ];

  const events = [
    {
      id: 1,
      name: "Fitness Expo 2024",
      date: "March 15, 2024",
      time: "10:00 AM - 6:00 PM",
      location: "Delhi Convention Center",
      price: "₹999",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      category: "Expo",
      seats: "Limited seats available"
    },
    {
      id: 2,
      name: "Yoga Workshop",
      date: "March 20, 2024",
      time: "9:00 AM - 12:00 PM",
      location: "Zen Fitness Studio",
      price: "₹1,499",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      category: "Workshop",
      seats: "Only 15 seats left"
    },
    {
      id: 3,
      name: "CrossFit Championship",
      date: "April 5, 2024",
      time: "8:00 AM - 5:00 PM",
      location: "Sports Complex",
      price: "₹2,999",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      category: "Competition",
      seats: "Early bird pricing"
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '🏪' },
    { id: 'supplements', name: 'Supplements', icon: '💊' },
    { id: 'equipment', name: 'Equipment', icon: '🏋️' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'clothing', name: 'Clothing', icon: '👕' },
    { id: 'nutrition', name: 'Nutrition', icon: '🥗' },
  ];

  const sortOptions = [
    { id: 'popular', name: 'Most Popular' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'newest', name: 'Newest First' },
  ];

  const eventCategories = [
    { id: 'all', name: 'All Events' },
    { id: 'workshop', name: 'Workshops' },
    { id: 'competition', name: 'Competitions' },
    { id: 'expo', name: 'Expos' },
    { id: 'seminar', name: 'Seminars' },
  ];

    const eventLocations = [
    { id: 'all', name: 'All Locations' },
    { id: 'delhi', name: 'Delhi' },
    { id: 'mumbai', name: 'Mumbai' },
    { id: 'bangalore', name: 'Bangalore' },
    { id: 'online', name: 'Online' },
  ];

  const renderShopTab = () => (
    <View style={styles.tabContent}>
      {/* Search and Filter Bar */}
      <View style={styles.searchFilterBar}>
        <TouchableOpacity style={styles.searchBar}>
          <Icon name="search" size={20} color="#666" />
          <Text style={styles.searchPlaceholder}>Search products...</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Icon name="filter" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[
                styles.categoryIcon,
                selectedCategory === category.id && styles.selectedCategoryIcon
              ]}>
                {category.icon}
              </Text>
              <Text style={[
                styles.categoryName,
                selectedCategory === category.id && styles.selectedCategoryName
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products Grid */}
      <View style={styles.productsGrid}>
        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productCard}
          >
            <View style={styles.productImageContainer}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{product.discount}</Text>
              </View>
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productCategory}>{product.category}</Text>
              <Text style={styles.productName}>{product.name}</Text>
              
              <View style={styles.productRating}>
                <Text style={styles.ratingText}>⭐ {product.rating}</Text>
                <Text style={styles.reviewsText}>({product.reviews})</Text>
              </View>

              <View style={styles.productPrice}>
                <Text style={styles.currentPrice}>{product.price}</Text>
                <Text style={styles.originalPrice}>{product.originalPrice}</Text>
              </View>

              <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEventsTab = () => (
    <View style={styles.tabContent}>
      {/* Event Filters */}
      <View style={styles.eventFilters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventFilterScroll}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Category:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {eventCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.filterChip,
                    selectedEventCategory === category.id && styles.selectedFilterChip
                  ]}
                  onPress={() => setSelectedEventCategory(category.id)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedEventCategory === category.id && styles.selectedFilterChipText
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Location:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {eventLocations.map((location) => (
                <TouchableOpacity
                  key={location.id}
                  style={[
                    styles.filterChip,
                    selectedEventLocation === location.id && styles.selectedFilterChip
                  ]}
                  onPress={() => setSelectedEventLocation(location.id)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedEventLocation === location.id && styles.selectedFilterChipText
                  ]}>
                    {location.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>

      {/* Events List */}
      <View style={styles.eventsList}>
        {events.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
          >
            <View style={styles.eventImageContainer}>
              <Image
                source={{ uri: event.image }}
                style={styles.eventImage}
                resizeMode="cover"
              />
              <View style={styles.eventCategory}>
                <Text style={styles.eventCategoryText}>{event.category}</Text>
              </View>
            </View>

            <View style={styles.eventInfo}>
              <Text style={styles.eventName}>{event.name}</Text>
              
              <View style={styles.eventDetails}>
                <View style={styles.eventDetail}>
                  <Text style={styles.eventDetailIcon}>📅</Text>
                  <Text style={styles.eventDetailText}>{event.date}</Text>
                </View>
                <View style={styles.eventDetail}>
                  <Text style={styles.eventDetailIcon}>🕒</Text>
                  <Text style={styles.eventDetailText}>{event.time}</Text>
                </View>
                <View style={styles.eventDetail}>
                  <Text style={styles.eventDetailIcon}>📍</Text>
                  <Text style={styles.eventDetailText}>{event.location}</Text>
                </View>
              </View>

              <View style={styles.eventFooter}>
                <View style={styles.eventPrice}>
                  <Text style={styles.eventPriceText}>{event.price}</Text>
                  <Text style={styles.eventSeats}>{event.seats}</Text>
                </View>
                <TouchableOpacity style={styles.bookEventButton}>
                  <Text style={styles.bookEventText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#e74c3c', '#c0392b']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Store</Text>
          <Text style={styles.headerSubtitle}>Shop & Book Events</Text>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'shop' && renderShopTab()}
        {activeTab === 'events' && renderEventsTab()}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter & Sort</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              <View style={styles.sortOptionsContainer}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.sortOption,
                      selectedSort === option.id && styles.selectedSortOption
                    ]}
                    onPress={() => setSelectedSort(option.id)}
                  >
                    <Text style={[
                      styles.sortOptionText,
                      selectedSort === option.id && styles.selectedSortOptionText
                    ]}>
                      {option.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.priceRangeContainer}>
                <Text style={styles.priceRangeText}>
                  ₹{priceRange.min} - ₹{priceRange.max}
                </Text>
                <View style={styles.priceSlider}>
                  <View style={styles.priceTrack}>
                    <View style={[styles.priceFill, { width: '60%' }]} />
                  </View>
                </View>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.applyFilterButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyFilterButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Store;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#e74c3c',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContent: {
    paddingTop: 20,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoryButton: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 120,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  productInfo: {
    padding: 12,
  },
  productCategory: {
    fontSize: 10,
    color: '#999',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#f39c12',
    marginRight: 4,
  },
  reviewsText: {
    fontSize: 10,
    color: '#999',
  },
  productPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  eventsList: {
    gap: 15,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImageContainer: {
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  eventCategory: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  eventCategoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  eventInfo: {
    padding: 15,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  eventDetails: {
    marginBottom: 15,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventDetailIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#666',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventPrice: {
    flex: 1,
  },
  eventPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 2,
  },
  eventSeats: {
    fontSize: 12,
    color: '#999',
  },
  bookEventButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookEventText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // Enhanced Filter Styles
  searchFilterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchPlaceholder: {
    marginLeft: 10,
    color: '#666',
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#e74c3c',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCategoryButton: {
    backgroundColor: '#e74c3c',
  },
  selectedCategoryIcon: {
    color: 'white',
  },
  selectedCategoryName: {
    color: 'white',
    fontWeight: '600',
  },

  // Event Filter Styles
  eventFilters: {
    marginBottom: 20,
  },
  eventFilterScroll: {
    maxHeight: 120,
  },
  filterSection: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedFilterChip: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  filterChipText: {
    fontSize: 12,
    color: '#666',
  },
  selectedFilterChipText: {
    color: 'white',
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  sortOptionsContainer: {
    gap: 10,
  },
  sortOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedSortOption: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#666',
  },
  selectedSortOptionText: {
    color: 'white',
    fontWeight: '600',
  },
  priceRangeContainer: {
    marginBottom: 20,
  },
  priceRangeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  priceSlider: {
    marginBottom: 10,
  },
  priceTrack: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
  },
  priceFill: {
    height: '100%',
    backgroundColor: '#e74c3c',
    borderRadius: 2,
  },
  applyFilterButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  applyFilterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
