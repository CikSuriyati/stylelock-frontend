/* eslint-disable */
// Mock manuscript data — social sciences paper for GJSS preview
// Conformant to MJCET/UiTM Journal Template 2024 APA v6.0

const MANUSCRIPT_TITLE = "Community resilience and digital connectivity in post-pandemic rural Malaysia: A mixed-methods inquiry";

// Article Info — left column of the abstract table
const ARTICLE_INFO = {
  history: [
    { label: "Received",   date: "12 January 2026" },
    { label: "Revised",    date: "04 March 2026"   },
    { label: "Accepted",   date: "18 March 2026"   },
    { label: "Published",  date: "30 April 2026"   }
  ],
  keywords: [
    "Rural resilience",
    "Digital divide",
    "Community informatics",
    "Post-pandemic Malaysia",
    "Mixed-methods"
  ],
  doi: "10.24191/gadingss.v10i2.01218"
};

// Each para = { style, text, originalStyle? }
const SOURCE_PARAS = [
  { style: "Title", text: MANUSCRIPT_TITLE, originalStyle: "Normal" },
  { style: "Author", text: "Suriyati Ujang¹*, Aisyah binti Rahman¹, Mohd Faiz Hassan²", originalStyle: "Normal" },
  { style: "Affiliation", text: "¹Faculty of Social Sciences, Universiti Teknologi MARA, 40450 Shah Alam, Selangor, Malaysia", originalStyle: "Normal" },
  { style: "Affiliation", text: "²Institute of Rural Studies, Universiti Putra Malaysia, 43400 Serdang, Selangor, Malaysia", originalStyle: "Normal" },

  // The abstract block — handled specially by Article Info table
  { style: "Abstract", text: "This study examines how rural Malaysian communities mobilised digital infrastructure to sustain economic and social functioning during and after the COVID-19 pandemic. Drawing on survey data from 412 households across three states and 28 follow-up interviews with community leaders, we identify three patterns of resilience: substitution, augmentation, and reconfiguration. Substitution communities replaced in-person livelihoods with digital equivalents; augmentation communities layered digital tools onto existing practices; reconfiguration communities re-organised social structures around connectivity. We argue that policy designed for the first pattern systematically under-serves the latter two, and propose a typology to guide more responsive intervention.", originalStyle: "Normal" },

  { style: "Heading A", text: "Introduction", originalStyle: "Heading 1" },
  { style: "Main Text", text: "The pandemic accelerated a shift toward digital mediation in nearly every aspect of Malaysian rural life — from agricultural marketing to religious gatherings to schooling. Yet the literature on rural digitalisation in Southeast Asia continues to frame connectivity primarily as a question of access (Tan & Loo, 2022; Rahman, 2023). This framing obscures a more interesting empirical question: once access is broadly available, what do communities actually do with it?", originalStyle: "Normal" },
  { style: "Main Text", text: "We approach this question through a mixed-methods inquiry conducted between January 2023 and April 2024 in Pahang, Terengganu, and Sarawak. Our analysis suggests that the post-pandemic landscape is better understood through patterns of practice than through measures of infrastructure alone.", originalStyle: "Normal" },

  { style: "Heading A", text: "Literature review", originalStyle: "Heading 2" },
  { style: "Heading B", text: "Resilience as a contested concept", originalStyle: "Heading 3" },
  { style: "Main Text", text: "Resilience scholarship has expanded considerably since the early formulations of Holling (1973), branching into community resilience (Norris et al., 2008), social-ecological resilience (Folke, 2016), and most recently digital resilience (Choudhury & Razak, 2023). The proliferation has not, however, produced consensus on operationalisation.", originalStyle: "Normal" },

  { style: "Heading B", text: "Rural digitalisation in Malaysia", originalStyle: "Heading 3" },
  { style: "Main Text", text: "Malaysia's National Digital Network plan (JENDELA, 2020) committed to 100% 4G coverage for populated areas by 2025. While infrastructural targets have been substantially met, the literature on use patterns remains thin (Lim, 2023; Yusof & Chen, 2024).", originalStyle: "Normal" },

  { style: "Heading A", text: "Methods", originalStyle: "Heading 2" },
  { style: "Main Text", text: "We adopted a sequential explanatory design (Creswell & Plano Clark, 2018). Phase one consisted of a household survey (n = 412) administered between January and May 2023. Phase two followed with 28 semi-structured interviews with community leaders, identified through purposive sampling weighted toward sites that scored at the extremes of the survey's connectivity-practice index.", originalStyle: "Normal" },

  { style: "Heading B", text: "Survey instrument", originalStyle: "Heading 3" },
  { style: "Main Text", text: "The instrument comprised 47 items across four sections: household demographics, connectivity inventory, practice typology, and self-reported well-being. Item construction drew on the Asian Development Bank's rural ICT survey (ADB, 2021) with modifications for the Malaysian context. Cronbach's α for the practice-typology subscale was 0.83.", originalStyle: "Normal" },

  { style: "Equation", text: "PI = Σ(wᵢ · pᵢ) / Σwᵢ", originalStyle: "Normal", props: { number: "1" } },
  { style: "Image Placeholder", text: "[Figure 1 — distribution plot]", originalStyle: "Picture" },
  { style: "Caption B", text: "Fig. 1. Distribution of practice-typology scores across the three states, with overlay of household income quintile.", originalStyle: "Normal" },

  { style: "Heading B", text: "Interview protocol", originalStyle: "Heading 3" },
  { style: "Main Text", text: "Interviews followed a semi-structured protocol with five core prompts and adaptive follow-up. All interviews were conducted in Bahasa Malaysia with simultaneous English notation; full transcripts were back-translated and verified by a second coder.", originalStyle: "Normal" },

  { style: "Heading A", text: "Findings", originalStyle: "Heading 2" },
  { style: "Main Text", text: "Three patterns emerged from the typology analysis. We label these substitution, augmentation, and reconfiguration. The patterns are not stages — communities did not progress through them — but rather durable orientations toward digital mediation that persisted across the study period.", originalStyle: "Normal" },

  { style: "Table Caption", text: "Table 1. Summary of three resilience patterns observed across 28 community sites.", originalStyle: "Normal" },
  { style: "Table Placeholder", text: "[Table 1]", originalStyle: "Picture",
    props: { rows: 4, table_data: [
      ["Pattern", "n (sites)", "Median PI", "Dominant practice"],
      ["Substitution", "14", "0.42", "Digital replacement of in-person commerce"],
      ["Augmentation", "9", "0.67", "Digital layered onto existing networks"],
      ["Reconfiguration", "5", "0.81", "Social structures re-formed around connectivity"]
    ]}
  },

  { style: "Heading B", text: "Substitution communities", originalStyle: "Heading 3" },
  { style: "Main Text", text: "In substitution communities, digital tools largely replaced functions that had previously been performed face-to-face. The pasar tani went online; tuition moved to WhatsApp; tahlil sessions migrated to Zoom. Crucially, the underlying social structure remained intact — the same individuals occupied the same roles, only the medium changed.", originalStyle: "Normal" },

  { style: "Heading B", text: "Augmentation communities", originalStyle: "Heading 3" },
  { style: "Main Text", text: "Augmentation communities used digital tools to extend rather than replace existing practice. A rubber smallholders' cooperative in Pahang continued to meet weekly in person, but now circulated price data through a Telegram channel that members consulted before bringing their crop to market. The in-person institution was strengthened, not displaced.", originalStyle: "Normal" },

  { style: "Heading A", text: "Discussion", originalStyle: "Heading 2" },
  { style: "Main Text", text: "The typology has direct policy implications. Programmes calibrated to substitution communities — primarily digital-literacy training and platform onboarding — are well-matched to that pattern but offer little to augmentation or reconfiguration sites, which already possess the relevant skills and instead require investments in governance, data infrastructure, and dispute resolution.", originalStyle: "Normal" },

  { style: "Heading A", text: "Conclusion", originalStyle: "Heading 2" },
  { style: "Main Text", text: "Rural resilience in post-pandemic Malaysia is more textured than aggregate connectivity statistics suggest. By attending to the patterns through which communities organise digital practice, researchers and policymakers can move beyond an access-centric framing toward interventions that meet communities where they actually are.", originalStyle: "Normal" },

  { style: "Heading A", text: "Acknowledgements", originalStyle: "Heading 1" },
  { style: "Main Text", text: "We thank the community leaders who hosted us across Pahang, Terengganu, and Sarawak. Field research was supported by UiTM internal grant 600-RMC/GIP 5/3 (072/2023).", originalStyle: "Normal" },

  { style: "Heading A", text: "Conflict of interest statement", originalStyle: "Heading 1" },
  { style: "Main Text", text: "The authors declare no conflicts of interest.", originalStyle: "Normal" },

  { style: "Heading A", text: "Ethics statement", originalStyle: "Heading 1" },
  { style: "Main Text", text: "The study received ethical approval from the UiTM Research Ethics Committee (REC/01/2023/AR-09). Informed consent was obtained from all participants.", originalStyle: "Normal" },

  { style: "Heading A", text: "References", originalStyle: "Heading 1" },
  { style: "Reference", text: "Choudhury, A., & Razak, N. (2023). Digital resilience in low-bandwidth settings: A framework. Journal of Community Informatics, 19(2), 88–112. https://doi.org/10.15353/joci.v19i2.4421", originalStyle: "Normal" },
  { style: "Reference", text: "Creswell, J. W., & Plano Clark, V. L. (2018). Designing and conducting mixed methods research (3rd ed.). SAGE Publications.", originalStyle: "Normal" },
  { style: "Reference", text: "Folke, C. (2016). Resilience (republished). Ecology and Society, 21(4), 44. https://doi.org/10.5751/ES-09088-210444", originalStyle: "Normal" },
  { style: "Reference", text: "Holling, C. S. (1973). Resilience and stability of ecological systems. Annual Review of Ecology and Systematics, 4, 1–23.", originalStyle: "Normal" },
  { style: "Reference", text: "Lim, S. (2023). Patterns of mobile use among rural Malaysian households. Asian Journal of Communication, 33(4), 412–429.", originalStyle: "Normal" },
  { style: "Reference", text: "Norris, F. H., Stevens, S. P., Pfefferbaum, B., Wyche, K. F., & Pfefferbaum, R. L. (2008). Community resilience as a metaphor, theory, set of capacities, and strategy for disaster readiness. American Journal of Community Psychology, 41(1–2), 127–150.", originalStyle: "Normal" },
  { style: "Reference", text: "Rahman, A. (2023). The persistence of the digital divide in Southeast Asia. ISEAS Publishing.", originalStyle: "Normal" },
  { style: "Reference", text: "Tan, P., & Loo, J. (2022). Connectivity and inequality: A regional review. Journal of Rural Studies, 92, 87–104.", originalStyle: "Normal" },
  { style: "Reference", text: "Yusof, R., & Chen, L. (2024). Beyond infrastructure: Use and meaning in rural ICT adoption. New Media & Society, 26(1), 55–74.", originalStyle: "Normal" }
];

// Available styles for the dropdown — MJCET style gallery
const AVAILABLE_STYLES = [
  "Title", "Author", "Affiliation", "Abstract", "Keywords",
  "Heading A", "Heading B", "Heading C",
  "Main Text", "Main Text [Heading A]", "Main Text [Heading B]",
  "Reference", "Caption B", "Table Caption",
  "Equation", "Footnote",
  "Image Placeholder", "Table Placeholder"
];

// MJCET/UiTM Style Guide — exact spec from XML forensic analysis
const GADING_GUIDE = [
  { style: "Title",        text: "Article title in sentence case — capitalise only the first word",
                           spec: "17 pt · Times New Roman · Centred · Line 401 tw exact" },
  { style: "Author",       text: "First Author¹*, Second Author¹, Third Author²",
                           spec: "13 pt · Centred · Line 300 tw exact" },
  { style: "Affiliation",  text: "¹Faculty, University, Postal Code, City, Country",
                           spec: "8 pt · Italic · Centred · Line 200 tw exact" },
  { style: "Abstract",     text: "Abstract appears in the right column of the Article Info table. Maximum 300 words. 9 pt, justified, line spacing 220 tw exact.",
                           spec: "9 pt · Justified · 220 tw exact · ≤ 300 words" },
  { style: "Keywords",     text: "Up to six keywords appear in the left column of the Article Info table.",
                           spec: "9 pt · max 6 keywords" },
  { style: "Heading A",    text: "PRIMARY HEADING — auto-numbered 1., 2., 3.",
                           spec: "10 pt · Bold · ALL CAPS · numId 18 · before 360 after 240 tw" },
  { style: "Heading B",    text: "Secondary heading — auto-numbered 1.1, 1.2",
                           spec: "10 pt · Bold · Mixed case · numId 16 · hanging 426 tw" },
  { style: "Heading C",    text: "Tertiary heading in italic (not bold)",
                           spec: "10 pt · Italic · NOT bold · before 240 after 60 tw" },
  { style: "Main Text",    text: "Main body paragraphs are justified at 9 pt with a first-line indent of 340 twips (~6.00 mm). Line spacing is 1.15× auto. Citations follow APA 7th edition.",
                           spec: "9 pt · Justified · indent 340 tw · 276/auto" },
  { style: "Reference",    text: "Reference, A. B., & Author, C. D. (2024). Reference entries use APA 7 with hanging indent of 357 twips. Journal of Examples, 12(3), 45–67. https://doi.org/...",
                           spec: "9 pt · Justified · hanging 357 tw · 220 tw exact · after 180 tw" },
  { style: "Caption B",    text: "Fig. 1. Figure captions are placed below the figure, left-aligned, 9 pt.",
                           spec: "9 pt · Left · BELOW figure · 200 tw exact" },
  { style: "Table Caption",text: "Table 1. Table captions are placed above the table, left-aligned, 8 pt bold.",
                           spec: "8 pt · Bold · Left · ABOVE table" },
  { style: "Equation",     text: "y = mx + b",
                           spec: "9 pt · Number right-aligned (1) · Cambria Math", props: { number: "1" } },
  { style: "Footnote",     text: "*Corresponding author. E-mail address: author@university.edu",
                           spec: "8 pt · Justified · indent 240 tw · First-page footer" }
];

// Compute auto-numbering for Heading A / Heading B paragraphs
function computeNumbering(items, styleFn) {
  let a = 0, b = 0;
  const map = {};
  items.forEach((para, i) => {
    const s = styleFn ? styleFn(i, para) : para.style;
    if (s === "Heading A") { a += 1; b = 0; map[i] = `${a}.`; }
    else if (s === "Heading B") { b += 1; map[i] = `${a}.${b}`; }
  });
  return map;
}

Object.assign(window, {
  MANUSCRIPT_TITLE,
  ARTICLE_INFO,
  SOURCE_PARAS,
  AVAILABLE_STYLES,
  GADING_GUIDE,
  computeNumbering
});
