# Dynamics of Anti-ABO(H) Antibody Expression in SARS-CoV-2-Infected Patients

This repository contains the data processing pipeline used in the study **"Dynamics of Anti-ABO(H) Antibody Expression in SARS-CoV-2-Infected Patients"**. 

It converts raw Luminex multiplex immunoassay data across patient cohorts, time points, and immunoglobulin isotypes into formatted JSON selections compatible with the **Glycan Array Dashboard (GLAD)** for downstream visualization and analysis.

---

## Overview & Workflow

The processing script performs the following steps:

1. **Patient Metadata Aggregation (`src/combine_patient_sets.js`)**:
   - Reads cohort/patient CSVs from the `patient_sets/` directory.
   - Cleans and consolidates patient identifiers, sample time points, ABO blood types, and tube IDs into `output/combined_patient_sets.json`.
2. **Validation & Quality Control (`src/checkForDuplicateTubeIDs.js`)**:
   - Scans the combined metadata to ensure all tube IDs across cohorts and time points are unique.
3. **Statistical Computation on Luminex Replicates (`src/generate_json_from_csv.js`)**:
   - Parses raw Luminex CSV files in `data_sets/`.
   - Aggregates technical replicates for each sample tube (e.g., `A7-T1`, `A7-T2`).
   - Calculates key metrics per glycan:
     - **Mean Signal (RFU)**: Mean Relative Fluorescence Units across replicates
     - **Standard Deviation (SD)**
     - **Coefficient of Variation (CV %)**
   - Ranks glycan targets per tube based on mean RFU.
4. **Metadata Mapping & GLAD Formatting (`src/mapJson.js`)**:
   - Maps each sample tube back to its patient metadata (Patient ID, Blood type, Time point, Tube ID, Isotype/Analysis type).
   - Generates standardized descriptive titles for GLAD visualization (e.g., `patientID-1_bloodType-B+_timePoint-1_tubeID-A7_analysisType-IgM`).
   - Assigns blood-type-specific bar colors:
     - **Blood Group A**: Maroon (`#800000`)
     - **Blood Group B**: Navy (`#000080`)
     - **Blood Group AB**: Dark Green (`#004d00`)
     - **Blood Group O**: Dark Brown (`#5a3d1a`)
   - Exports the final GLAD-ready selection files to the `output/` directory as `*_GLAD_selection.txt`.

---

## Repository Structure

```text
.
├── data_sets/                # Raw Luminex CSV datasets for each cohort, time point, and isotype
├── patient_sets/             # Patient metadata CSVs (Patient ID, Time point, Blood type, Tube ID)
├── output/                   # Processed GLAD selection JSON files (*_GLAD_selection.txt)
├── src/
│   ├── combine_patient_sets.js     # Merges patient metadata across cohorts
│   ├── checkForDuplicateTubeIDs.js # Checks for unique tube IDs across patient records
│   ├── generate_json_from_csv.js  # Calculates RFU, SD, CV, and rankings from raw Luminex data
│   └── mapJson.js                  # Maps patient metadata and color coding for GLAD
├── index.js                  # Main entry point to run the processing pipeline
├── package.json              # Project dependencies and npm scripts
└── README.md                 # Project documentation
```

---

## Input Data Specifications

### 1. Patient Metadata (`patient_sets/*.csv`)
Contains mapping between patients, sample collection time points, blood types, and tube identifiers:
```csv
Patient ID,Time point,Blood type,Tube ID
1,1,B+,A7
1,2,B+,R7
2,1,O+,F8
```

### 2. Luminex Assay Datasets (`data_sets/*.csv`)
Contains glycan structures along with replicate measurements (e.g., `-T1`, `-T2`) for each tube ID:
```csv
Name,Glycan,A7-T1,A7-T2,F8-T1,F8-T2
GalNAca1-3(Fuca1-2)Galb1-3GlcNAcb1-3Galb1-4Glc-MTZ,A1,-508,-180,-187.5,64
GalNAca1-3(Fuca1-2)Galb1-4GlcNAcb1-3Galb1-4Glc-MTZ,A2,-1125,-628.5,-382,57.5
```
*Note: Isotype names (`IgG`, `IgA`, `IgM`) in the filename are automatically detected by the script.*

---

## Output Format (GLAD Input)

Each processed file in `output/*_GLAD_selection.txt` contains an array of JSON objects formatted for GLAD:

```json
[
  {
    "ID": 1,
    "Name": "GalNAca1-3(Fuca1-2)Galb1-3GlcNAcb1-3Galb1-4Glc-MTZ",
    "Name2": "A1",
    "Title": "patientID-1_bloodType-B+_timePoint-1_tubeID-A7_analysisType-IgM",
    "RFU": -344,
    "SD": 164,
    "CV": -47.67,
    "Rank": 8,
    "barcolor": "#000080",
    "PatientID": "1",
    "BloodType": "B+",
    "TimePoint": "1",
    "TubeID": "A7",
    "AnalysisType": "IgM"
  }
]
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v24.13.0 or higher recommended)
- `npm` (bundled with Node.js)

### Installation
Clone this repository and install dependencies:
```bash
npm install
```

### Running the Pipeline
To process all datasets and generate GLAD files in the `output/` directory:
```bash
npm run process
```
or
```bash
node index.js
```

If an isotype/analysis type is not recognized automatically from a filename in `data_sets/`, the CLI will interactively prompt you to specify the isotype (e.g., `IgG`, `IgA`, `IgM`).

---

## Visualization in GLAD

1. Navigate to the [Glycan Array Dashboard (GLAD)](https://glycotoolkit.com/GLAD/).
2. Load the generated `*_GLAD_selection.txt` files from the `output/` folder as "Selections" in GLAD.
3. Visualize antibody binding profiles, comparisons across cohorts and time points, and heatmaps/charts grouped by blood type and isotype.

---

## Citation & Reference

If you use this code or data, please cite the corresponding publication:
> **Dynamics of Anti-ABO(H) Antibody Expression in SARS-CoV-2-Infected Patients**

## License

This project is licensed under the [MIT License](LICENSE.md).