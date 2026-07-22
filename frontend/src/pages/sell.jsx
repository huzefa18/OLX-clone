import { useState, useEffect } from "react";
import {
  Container, Row, Col, Form, Button, Card, Spinner, Alert, Image,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api";

export default function Sell() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [imgPreview, setImgPreview] = useState(null);
  const [useUrl,     setUseUrl]     = useState(false);
  const [imgFile,    setImgFile]    = useState(null);
  const [form, setForm] = useState({
    title:       "",
    description: "",
    price:       "",
    location:    "",
    category:    "",
    imgUrl:      "",
  });

  // Fetch categories for dropdown
  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setImgPreview(URL.createObjectURL(file));
    }
  };

  const handleUrlChange = (e) => {
    handleChange(e);
    setImgPreview(e.target.value);
  };

  const validate = () => {
    if (!form.title.trim())    return "Ad title is required.";
    if (!form.price.trim())    return "Price is required.";
    if (!form.location.trim()) return "Location is required.";
    if (!form.category)        return "Please select a category.";
    if (!useUrl && !imgFile)   return "Please upload an image.";
    if (useUrl && !form.imgUrl.trim()) return "Please enter a valid image URL.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title",       form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("price",       form.price.trim());
      formData.append("location",    form.location.trim());
      formData.append("category",    form.category);
      if (useUrl) {
        formData.append("imgUrl", form.imgUrl.trim());
      } else {
        formData.append("img", imgFile);
      }

      const { data } = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/product/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to post listing. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ──────────────────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: 60 }}>
      {/* ── Page header ── */}
      <div style={{ backgroundColor: "#002f34", color: "#fff", padding: "28px 0 20px" }}>
        <Container style={{ maxWidth: 800 }}>
          <h1 style={{ fontWeight: 700, marginBottom: 4, fontSize: "1.8rem" }}>
            Post Your Ad
          </h1>
          <p style={{ opacity: 0.75, marginBottom: 0 }}>
            Reach millions of buyers — it&apos;s free!
          </p>
        </Container>
      </div>

      <Container style={{ maxWidth: 800 }} className="py-4">
        {error && (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setError("")}
            className="mb-4"
          >
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* ── Section 1: Ad Details ── */}
          <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 12 }}>
            <Card.Body className="p-4">
              <h5 style={{ color: "#002f34", fontWeight: 700, marginBottom: 20 }}>
                📋 Ad Details
              </h5>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 600 }}>
                  Ad Title <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder='e.g. iPhone 14 Pro Max 256GB Space Black'
                  value={form.title}
                  onChange={handleChange}
                  maxLength={120}
                  style={{ borderColor: "#ddd", borderRadius: 8 }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 600 }}>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  placeholder="Describe your item — condition, features, reason for selling..."
                  value={form.description}
                  onChange={handleChange}
                  style={{ borderColor: "#ddd", borderRadius: 8, resize: "vertical" }}
                />
              </Form.Group>

              <Form.Group className="mb-0">
                <Form.Label style={{ fontWeight: 600 }}>
                  Category <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  style={{ borderColor: "#ddd", borderRadius: 8 }}
                >
                  <option value="">— Select a category —</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>

          {/* ── Section 2: Price & Location ── */}
          <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 12 }}>
            <Card.Body className="p-4">
              <h5 style={{ color: "#002f34", fontWeight: 700, marginBottom: 20 }}>
                💰 Price & Location
              </h5>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3 mb-md-0">
                    <Form.Label style={{ fontWeight: 600 }}>
                      Price (Rs) <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      placeholder="e.g. 45000"
                      value={form.price}
                      onChange={handleChange}
                      min={0}
                      style={{ borderColor: "#ddd", borderRadius: 8 }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: 600 }}>
                      Location <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      placeholder="e.g. DHA, Karachi"
                      value={form.location}
                      onChange={handleChange}
                      style={{ borderColor: "#ddd", borderRadius: 8 }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* ── Section 3: Image ── */}
          <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 12 }}>
            <Card.Body className="p-4">
              <h5 style={{ color: "#002f34", fontWeight: 700, marginBottom: 20 }}>
                📷 Photo
              </h5>

              {/* Toggle */}
              <div className="d-flex gap-4 mb-3">
                <Form.Check
                  type="radio"
                  id="radio-upload"
                  label="Upload from device"
                  checked={!useUrl}
                  onChange={() => { setUseUrl(false); setImgPreview(null); }}
                />
                <Form.Check
                  type="radio"
                  id="radio-url"
                  label="Use image URL"
                  checked={useUrl}
                  onChange={() => { setUseUrl(true); setImgFile(null); setImgPreview(form.imgUrl || null); }}
                />
              </div>

              {!useUrl ? (
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ borderColor: "#ddd", borderRadius: 8 }}
                />
              ) : (
                <Form.Control
                  type="url"
                  name="imgUrl"
                  placeholder="https://example.com/photo.jpg"
                  value={form.imgUrl}
                  onChange={handleUrlChange}
                  style={{ borderColor: "#ddd", borderRadius: 8 }}
                />
              )}

              {/* Preview */}
              {imgPreview && (
                <div className="mt-3">
                  <Image
                    src={imgPreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: 260,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid #eee",
                    }}
                    onError={() => setImgPreview(null)}
                  />
                </div>
              )}
            </Card.Body>
          </Card>

          {/* ── Submit ── */}
          <Button
            type="submit"
            disabled={loading}
            className="w-100 py-3"
            style={{
              backgroundColor: "#002f34",
              border: "none",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: "1.05rem",
              letterSpacing: 0.3,
            }}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Posting…
              </>
            ) : (
              "🚀 Post Your Ad"
            )}
          </Button>
        </Form>
      </Container>
    </div>
  );
}
