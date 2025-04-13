export const styles = {
  container: {
    backgroundColor: "#1b1a1f", // Updated dark background
    minHeight: "100vh",
    padding: "0", // Remove padding
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#f5f5f5", // Lighter text for dark background
    lineHeight: 1.5,
  },
  // Updated layout styles to take full screen
  appLayout: {
    display: "flex",
    flexDirection: "column", // Changed to column to stack navbar on top
    width: "100%",
    height: "100vh",
    backgroundColor: "#1b1a1f", // Updated dark background
    overflow: "hidden",
  },
  navbar: {
    //width: "100%", // Full width
    backgroundColor: "var(--main-bg)", // Use CSS variable for background
    color: "#fff",
    padding: "8px 15%", // Adjusted padding: 8px top/bottom, 20% left/right
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "auto",
    position: "sticky",
    top: 0,
    left: 0,
    zIndex: 100,
    transition: "border-bottom 0.6s ease",
    borderBottom: "1px solid transparent",
  },
  navbarScrolled: {
    borderBottom: "1px solid black",
    transition: "border-bottom 0.2s ease",
  },
  navbarHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0",
    marginRight: "0",
  },
  navbarLogo: {
    width: "50px", // Reduced logo size
    height: "50px", // Reduced logo size
    marginRight: "12px",
    objectFit: "contain",
  },
  navbarTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#fc0800", // Red color for the title
    margin: 0,
    whiteSpace: "nowrap", // Prevent wrapping
  },
  navList: {
    display: "flex",
    flexDirection: "row",
    gap: "8px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  navItem: {
    padding: "8px 16px", // Reduced vertical padding
    borderRadius: "8px",
    color: "#f5f5f5", // Light grey text
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.2s ease", // Transition color only
    display: "block",
    ":hover": {
      // Added hover style
      color: "var(--accent-red)", // Corrected color to accent red variable
    },
  },
  navItemActive: {
    //backgroundColor: "rgba(252, 8, 0, 0.2)", // Transparent red for active item
    fontWeight: "600",
    color: "#fc0800", // Red text for active item
  },
  navbarActions: {
    display: "flex",
    alignItems: "center", // Align items vertically
  },
  navbarRightContainer: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto", // Push to the right
    gap: "24px", // Adjust gap between navList and actions
  },
  mainContent: {
    flex: 1,
    padding: "32px",
    height: "calc(100vh - 66px)", // Updated for thinner navbar
    overflowY: "auto",
    backgroundColor: "#1b1a1f", // Updated dark background
    // Prevent scroll chaining/bounce effect when scrolling past boundaries
    overscrollBehaviorY: "contain",
  },
  // Styles for page content
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px 0",
  },
  mainHeading: {
    fontSize: "3rem",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "24px",
    color: "#fc0800", // Red for headings
    paddingBottom: "16px",
  },
  subHeading: {
    fontSize: "2rem",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "24px",
    color: "#fc0800", // Red for headings
    borderBottom: "2px solid #444", // Darker border
    paddingBottom: "16px",
  },
  vstack: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    maxWidth: "700px",
    margin: "0 auto",
    backgroundColor: "#222", // Dark background
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)", // Darker shadow
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "24px",
    color: "#fc0800", // Red for headings
    borderBottom: "2px solid #444", // Darker border
    paddingBottom: "16px",
  },
  input: {
    padding: "12px 16px",
    fontSize: "1rem",
    border: "1px solid #555",
    borderRadius: "6px",
    backgroundColor: "#444", // Dark input background
    color: "#f5f5f5", // Light text
    width: "100%",
    transition: "border-color 0.2s ease",
  },
  button: {
    padding: "12px 20px",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: "#fc0800", // Red button
    color: "white",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
  },
  buttonOutline: {
    border: "1px solid #fc0800", // Red border
    color: "#fc0800", // Red text
    backgroundColor: "transparent",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#f5f5f5", // Light text
  },
  textarea: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "1rem",
    border: "1px solid #555",
    borderRadius: "6px",
    minHeight: "100px",
    resize: "vertical",
    fontFamily: "inherit",
    backgroundColor: "#444", // Dark textarea background
    color: "#f5f5f5", // Light text
  },
  fileUpload: {
    border: "2px dashed #555",
    borderRadius: "8px",
    padding: "24px",
    textAlign: "center",
    color: "#f5f5f5", // Light text
    cursor: "pointer",
    transition: "all 0.2s ease",
    backgroundColor: "#2a2a2a", // Dark upload area
  },
  fileUploadHover: {
    borderColor: "#fc0800", // Red border on hover
    backgroundColor: "rgba(252, 8, 0, 0.1)", // Transparent red
    color: "#fc0800", // Red text
  },
  previewArea: {
    border: "1px solid #555",
    borderRadius: "8px",
    padding: "16px",
    backgroundColor: "#2a2a2a", // Dark preview area
    marginTop: "16px",
  },
  previewTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#f5f5f5", // Light text
  },
  previewWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
  },
  previewItem: {
    position: "relative",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
    borderRadius: "8px",
    overflow: "hidden",
  },
  previewImage: {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "6px",
    border: "1px solid #444", // Darker border
  },
  removeButton: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    background: "#fc0800", // Red remove button
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    fontSize: "14px",
    lineHeight: "24px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
    zIndex: 10,
  },
  resultArea: {
    marginTop: "24px",
    border: "1px solid #555",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
    backgroundColor: "#2a2a2a", // Dark result area
  },
  resultTitle: {
    backgroundColor: "#222", // Darker title background
    padding: "12px 16px",
    fontWeight: "600",
    borderBottom: "1px solid #555",
    color: "#f5f5f5", // Light text
  },
  resultImage: {
    display: "block",
    width: "100%",
    maxHeight: "500px",
    objectFit: "contain",
    background: "#333", // Dark image background
    padding: "12px",
  },
  radioContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "20px",
    padding: "16px",
    border: "1px solid #555",
    borderRadius: "8px",
    backgroundColor: "#2a2a2a", // Dark radio container
  },
  radioOption: {
    padding: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "flex-start",
  },
  radioOptionSelected: {
    backgroundColor: "#fc0800", // Red selected radio
    color: "white",
  },
  radioOptionUnselected: {
    backgroundColor: "#333", // Dark unselected radio
    border: "1px solid #555",
  },
  radioLabel: {
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  radioDescription: {
    marginTop: "8px",
    fontSize: "0.9rem",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    gap: "16px",
    color: "#f5f5f5", // Light text
    textAlign: "center",
  },
  loadingSpinner: {
    border: "4px solid #333",
    borderRadius: "50%",
    borderTop: "4px solid #fc0800",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
  errorMessage: {
    color: "#fc0800", // Red error text
    backgroundColor: "rgba(252, 8, 0, 0.1)", // Transparent red background
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  successMessage: {
    color: "#10B981", // Keep success green
    backgroundColor: "rgba(16, 185, 129, 0.1)", // Transparent green
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  // Updated home page styles
  homeLogoContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "40px",
  },
  homeLogo: {
    width: "240px",
    height: "240px",
    objectFit: "contain",
  },
  // Gallery styles
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: "24px",
    marginTop: "24px",
  },
  galleryItem: {
    backgroundColor: "#222",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 12px rgba(0, 0, 0, 0.3)",
    },
  },
  galleryImage: {
    width: "100%",
    aspectRatio: "1/1",
    objectFit: "cover",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  },
  galleryCaption: {
    padding: "12px",
  },
  galleryPrompt: {
    fontSize: "0.9rem",
    marginBottom: "8px",
    color: "#f5f5f5",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  galleryDate: {
    fontSize: "0.8rem",
    color: "#999",
  },
  // Pagination styles
  paginationControls: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "32px",
    gap: "16px",
  },
  paginationInfo: {
    color: "#f5f5f5",
    fontWeight: "500",
  },
  // Message container
  messageContainer: {
    textAlign: "center",
    padding: "32px",
    backgroundColor: "#222",
    borderRadius: "8px",
    margin: "32px 0",
  },
  // Success button state
  buttonSuccess: {
    backgroundColor: "#0fc95b", // Green for success
    color: "white",
  },
  buttonSecondary: {
    backgroundColor: "#0077cc", // Blue for secondary actions
    color: "white",
  },
  // Slider specific styles
  sliderContainer: {
    // border: "1px solid #444",
    // borderRadius: "8px",
    padding: "10px",
    // backgroundColor: "#222",
    // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  },
  ":root": {
    "--main-bg": "#1b1a1f",
  },
};
