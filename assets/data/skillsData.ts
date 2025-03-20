
export interface Skill {
    label: string;
    value: string;
  }
  
  export interface SkillData {
    category: string;
    skills: Skill[];
  }

export const skillsData: SkillData[] = [
    {
      "category": "Digital & Tech Skills",
      "skills": [
        { "label": "Software Development", "value": "software_dev" },
        { "label": "UI/UX Design", "value": "ui_ux_design" },
        { "label": "Data Science & AI", "value": "data_science_ai" },
        { "label": "Cybersecurity", "value": "cybersecurity" },
        { "label": "Digital Marketing", "value": "digital_marketing" },
        { "label": "Cloud Computing", "value": "cloud_computing" },
        { "label": "Computer Networking & Repairs", "value": "networking_repairs" }
      ]
    },
    {
      "category": "Engineering & Technical Trades",
      "skills": [
        { "label": "Electrical Wiring & Installation", "value": "electrical_wiring" },
        { "label": "Plumbing & Pipe Fitting", "value": "plumbing" },
        { "label": "Welding & Metal Fabrication", "value": "welding" },
        { "label": "Solar Panel & Renewable Energy", "value": "solar_energy" },
        { "label": "Automotive Repairs & Maintenance", "value": "auto_repairs" },
        { "label": "Refrigeration & Air Conditioning", "value": "hvac" }
      ]
    },
    {
      "category": "Business & Entrepreneurship",
      "skills": [
        { "label": "Business Development & Strategy", "value": "business_dev" },
        { "label": "Financial Literacy & Bookkeeping", "value": "financial_literacy" },
        { "label": "E-commerce & Online Business", "value": "ecommerce" },
        { "label": "Project Management", "value": "project_management" },
        { "label": "Import & Export Trade", "value": "import_export" }
      ]
    },
    {
      "category": "Creative & Design Skills",
      "skills": [
        { "label": "Graphic Design & Branding", "value": "graphic_design" },
        { "label": "Fashion Design & Tailoring", "value": "fashion_design" },
        { "label": "Photography & Videography", "value": "photography" },
        { "label": "Motion Graphics & Animation", "value": "motion_graphics" },
        { "label": "Interior Decoration & Event Planning", "value": "interior_design" }
      ]
    },
    {
      "category": "Agriculture & Food Production",
      "skills": [
        { "label": "Crop Farming (Cassava, Rice, Maize, etc.)", "value": "crop_farming" },
        { "label": "Poultry & Livestock Farming", "value": "poultry_farming" },
        { "label": "Fish Farming (Aquaculture)", "value": "fish_farming" },
        { "label": "Beekeeping & Honey Production", "value": "beekeeping" },
        { "label": "Agro-Processing & Food Packaging", "value": "agro_processing" }
      ]
    },
    {
      "category": "Beauty & Personal Care",
      "skills": [
        { "label": "Hairdressing & Barbing", "value": "hairdressing" },
        { "label": "Skincare & Cosmetology", "value": "cosmetology" },
        { "label": "Makeup Artistry", "value": "makeup" },
        { "label": "Nail Technology (Manicure & Pedicure)", "value": "nail_tech" },
        { "label": "Massage Therapy & Spa Services", "value": "massage_therapy" }
      ]
    },
    {
      "category": "Construction & Building",
      "skills": [
        { "label": "Bricklaying & Masonry", "value": "bricklaying" },
        { "label": "Tiling & Flooring", "value": "tiling" },
        { "label": "Painting & Decoration", "value": "painting" },
        { "label": "Roofing & Ceiling Work", "value": "roofing" },
        { "label": "Interior & Exterior Finishing", "value": "interior_finishing" }
      ]
    },
    {
      "category": "Media & Communication",
      "skills": [
        { "label": "Content Writing & Blogging", "value": "content_writing" },
        { "label": "Public Speaking & Presentation", "value": "public_speaking" },
        { "label": "Social Media Management", "value": "social_media" },
        { "label": "Journalism & Investigative Reporting", "value": "journalism" }
      ]
    },
    {
      "category": "Healthcare & Wellness",
      "skills": [
        { "label": "First Aid & Emergency Response", "value": "first_aid" },
        { "label": "Homecare & Elderly Caregiving", "value": "caregiving" },
        { "label": "Fitness Training & Nutrition", "value": "fitness" },
      ]
    },
    {
      "category": "Handcrafts & Traditional Skills",
      "skills": [
        { "label": "Leatherwork & Shoemaking", "value": "leatherwork" },
        { "label": "Pottery & Ceramics", "value": "pottery" },
        { "label": "Basket Weaving & Traditional Crafts", "value": "basket_weaving" },
        { "label": "Wood Carving & Sculpture", "value": "wood_carving" }
      ]
    },
    {
      "category": "Catering & Hospitality",
      "skills": [
        { "label": "Catering & Event Catering", "value": "catering" },
        { "label": "Pastry & Baking", "value": "pastry_baking" },
        { "label": "Mixology & Bartending", "value": "mixology" },
      ]
    }
    
  ]
  