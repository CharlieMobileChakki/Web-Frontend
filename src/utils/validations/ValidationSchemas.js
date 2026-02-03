import * as Yup from "yup";


// 🔹 Sign In Validation (phone + otp)
export const signInSchema = Yup.object().shape({
  phone: Yup.string()
    .required("phone is required")
    .matches(/^[6-9]\d{9}$/, "Phone must be 10 digits and start with 6,7,8, or 9"),
  otp: Yup.string()
    .matches(/^[0-9]{4,6}$/, "OTP must be 4-6 digits")
    .required("otp is required")
});




// 🔹 Sign Up Validation (name, phone, otp, address)
export const signUpSchema = Yup.object().shape({
  userName: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must not exceed 20 characters"),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Phone must be 10 digits starting with 6-9")
    .required("Phone is required"),
  otp: Yup.string()
    .matches(/^[0-9]{4,6}$/, "OTP must be 4-6 digits")
    .required("OTP is required"),
  address: Yup.object().shape({
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zipCode: Yup.string().required("Zip Code is required"),
    country: Yup.string().required("Country is required"),
  }),
})




// contact us schema
export const ContactSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must not exceed 20 characters"),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Phone must be 10 digits and start with 6,7,8, or 9")
    .required("Phone is required"),
  message: Yup.string().required("Message is required"),
})





// booking schema
export const BookingSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must not exceed 20 characters"),

  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Mobile number must be valid (10 digits starting with 6-9)")
    .required("Mobile number is required"),
  serviceType: Yup.string()
    .required("Service type is required")
    .matches(/^[A-Za-z\s]+$/, "Service type must contain only letters"),
  date: Yup.date()
    .required("Date is required")
    .min(new Date().toISOString().split("T")[0], "Date cannot be in the past"),
  time: Yup.string()
    .required("Time is required")
    .test("is-future-time", "Time cannot be in the past", function (value) {
      const { date } = this.parent;
      if (!date || !value) return true;
      const selectedDate = new Date(date);
      const today = new Date();
      const [hours, minutes] = value.split(":").map(Number);
      selectedDate.setHours(hours, minutes, 0, 0);
      return selectedDate >= today;
    }),
  address: Yup.object().shape({
    manualAddress: Yup.object().shape({
      street: Yup.string().required("Street is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      zipCode: Yup.string().required("Zip Code is required"),
      country: Yup.string().required("Country is required"),
    }),
  }),
});





/// profile schema
export const profileSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must not exceed 20 characters"),
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Mobile number must be valid (10 digits starting with 6-9)")
    .required("Mobile number is required"),
});





// address schema
export const addressSchema = Yup.object().shape({
  street: Yup.string().required("Street is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zipCode: Yup.string()
    .required("Zip Code is required")
    .matches(/^\d{5,6}$/, "Zip Code must be 5 or 6 digits"),
});




/* -------------------- 🔹 Admin Login Schema -------------------- */
export const adminLoginSchema = Yup.object().shape({
  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Mobile must be 10 digits and start with 6-9"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters"),
});




/* -------------------- 🔹 Admin Product Schema -------------------- */
export const adminProductSchema = Yup.object().shape({
  name: Yup.string()
    .required("Product name is required")
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must not exceed 100 characters"),

  category: Yup.string().required("Category is required"),

  isFeatured: Yup.boolean(),

  images: Yup.array()
    .of(Yup.string().url("Each image must be a valid URL"))
    .min(1, "At least one product image is required"),

  variants: Yup.array()
    .of(
      Yup.object().shape({
        quantity: Yup.number()
          .typeError("Quantity must be a number")
          .required("Quantity is required")
          .min(1, "Quantity must be at least 1"),

        nameSuffix: Yup.string()
          .max(20, "Unit/Name suffix cannot exceed 20 characters")
          .required("Unit/Name suffix is required"),

        description: Yup.string()
          .required("Description is required")
          .min(5, "Description must be at least 5 characters")
          .max(500, "Description must not exceed 500 characters"),

        price: Yup.number()
          .typeError("Price must be a number")
          .required("MRP is required")
          .min(0, "Price cannot be negative"),

        sellingPrice: Yup.number()
          .typeError("Selling price must be a number")
          .required("Selling price is required")
          .min(0, "Selling price cannot be negative"),

        purchasePrice: Yup.number()
          .typeError("Purchase price must be a number")
          .required("Purchase price is required")
          .min(0, "Purchase price cannot be negative"),

        stock: Yup.number()
          .typeError("Stock must be a number")
          .required("Stock is required")
          .min(0, "Stock cannot be negative"),
      })
    )
    .min(1, "At least one variant is required"),
});




/* -------------------- 🔹 Admin Booking Product Schema -------------------- */
/* -------------------- 🔹 Admin Booking Product Schema -------------------- */


export const adminBookingProductSchema = Yup.object().shape({
  name: Yup.string()
    .required("Product name is required")
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must not exceed 100 characters"),

  category: Yup.string().required("Category is required"),

  status: Yup.string().oneOf(["active", "inactive"], "Invalid status"),

  isFeatured: Yup.boolean(),

  images: Yup.array()
    .of(Yup.string().url("Each image must be a valid URL"))
    .min(1, "At least one product image is required"),

  variants: Yup.array()
    .of(
      Yup.object().shape({
        quantity: Yup.number()
          .typeError("Quantity must be a number")
          .required("Quantity is required")
          .min(1, "Quantity must be at least 1"),

        nameSuffix: Yup.string()
          .required("Suffix is required")
          .max(20, "Suffix cannot exceed 20 characters"),

        description: Yup.string()
          .required("Description is required")
          .min(5, "Description must be at least 5 characters")
          .max(500, "Description must not exceed 500 characters"),

        price: Yup.number()
          .typeError("MRP must be a number")
          .required("MRP is required")
          .min(0, "MRP cannot be negative"),

        sellingPrice: Yup.number()
          .typeError("Selling price must be a number")
          .required("Selling price is required")
          .min(0, "Selling price cannot be negative")
          .test(
            "sellingPrice-less-than-price",
            "Selling price must be less than or equal to MRP",
            function (value) {
              const { price } = this.parent;
              if (value === undefined || price === undefined) return true;
              return Number(value) <= Number(price);
            }
          ),

        purchasePrice: Yup.number()
          .typeError("Purchase price must be a number")
          .required("Purchase price is required")
          .min(0, "Purchase price cannot be negative"),

        stock: Yup.number()
          .typeError("Stock must be a number")
          .required("Stock is required")
          .min(0, "Stock cannot be negative"),

        lowStockThreshold: Yup.number()
          .typeError("Low stock threshold must be a number")
          .min(0, "Low stock threshold cannot be negative")
          .nullable(),
      })
    )
    .min(1, "At least one variant is required"),
});





export const adminBookingVariantSchema = Yup.object().shape({
  quantity: Yup.number().required("Quantity required").min(1),
  nameSuffix: Yup.string().required("Suffix required"),
  description: Yup.string().required("Description required").min(5),
  price: Yup.number().required("MRP required").min(0),
  sellingPrice: Yup.number().required("Selling price required").min(0),
  purchasePrice: Yup.number().required("Purchase price required").min(0),
  stock: Yup.number().required("Stock required").min(0),
});





/* -------------------- 🔹 Admin Booking Schema -------------------- */
/* -------------------- 🔹 Admin Booking Schema -------------------- */

export const adminBookingCategorySchema = Yup.object().shape({
  name: Yup.string()
    .required("Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(60, "Category name must not exceed 60 characters"),

  minimumOrderAmount: Yup.number()
    .typeError("Minimum order amount must be a number")
    .required("Minimum order amount is required")
    .min(0, "Minimum order amount cannot be negative"),

  images: Yup.array()
    .of(Yup.string().url("Each image must be a valid URL"))
    .min(1, "At least one category image is required"),
});





