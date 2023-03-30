export const rules = Object.freeze({
  auth: {
    email: [
      (v: string) => !!v || "E-mail is required",
      (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    password: [
      (v: string) => !!v || "Password is required",
      (v: string) =>
        (v && v.length >= 8) ||
        "Password must be equal or greater than 8 characters",
      (v: string) =>
        (v && v.length <= 30) ||
        "Password must be equal or less than 30 characters",
    ],
  },
  book: {
    title: [
      (value: string) => !!value || "Title is required",
      (value: string) =>
        value.length <= 50 || "Title must be less than 50 characters",
    ],
    buy: [
      (value: number) => !!value || "Buy is required",
      (value: number) => value <= 9999 || "Buy must be less than 9999",
      (value: number) => value >= 0 || "Buy must be greater than 0",
    ],
    read(buy: number) {
      return [
        (value: number) => value >= 0 || "Read is required",
        (value: number) => value <= buy || "Read must be less than Buy",
      ];
    },
    price: [
      (value: number) => !!value || "Price is required",
      (value: number) => value <= 9999 || "Price must be less than 9999",
      (value: number) => value >= 0 || "Price must be greater than 0",
    ],
    comment: [
      (value: string) =>
        value.length <= 500 || "Comment must be less than 500 characters",
    ],
  },
});
