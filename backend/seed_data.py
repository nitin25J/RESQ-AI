import asyncio
import logging
from sqlalchemy import text
from app.database import engine, Base, AsyncSessionLocal
from app.db_models import DiseaseDataset

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed_data")

# 60+ Diseases across 4 categories
COMMON_EMERGENCIES = [
    # --- CRITICAL ---
    {
        "category": "Critical",
        "disease_name": "Cardiac Arrest",
        "description": "Sudden loss of blood flow resulting from the failure of the heart to pump effectively. The person is unconscious and not breathing normally.",
        "symptoms": ["Unconsciousness", "No breathing or only gasping", "No pulse"],
        "immediate_first_aid": [
            "Call emergency services immediately (112).",
            "Begin CPR immediately (Push hard and fast in the center of the chest).",
            "Use an AED (Automated External Defibrillator) if available.",
            "Continue CPR until medical help arrives or the person starts breathing."
        ],
        "requires_hospital": True
    },
    {
        "category": "Critical",
        "disease_name": "Heart Attack (Myocardial Infarction)",
        "description": "A blockage of blood flow to the heart muscle, usually caused by a blood clot.",
        "symptoms": ["Chest pain or pressure (radiating to arm, jaw, or back)", "Shortness of breath", "Cold sweat", "Nausea or lightheadedness"],
        "immediate_first_aid": [
            "Call emergency services immediately (112).",
            "Have the person sit down, rest, and try to keep calm.",
            "Loosen any tight clothing.",
            "If they are not allergic, have them chew and swallow an aspirin.",
            "If they go unconscious and stop breathing, begin CPR."
        ],
        "requires_hospital": True
    },
    {
        "category": "Critical",
        "disease_name": "Stroke",
        "description": "A medical emergency occurring when poor blood flow to the brain results in cell death.",
        "symptoms": ["Sudden numbness or weakness in the face, arm, or leg (especially on one side)", "Sudden confusion or trouble speaking", "Sudden trouble seeing", "Sudden severe headache"],
        "immediate_first_aid": [
            "Call emergency services immediately (112). Time is critical.",
            "Remember FAST: Face drooping, Arm weakness, Speech difficulty, Time to call 112.",
            "Do not give the person anything to eat or drink.",
            "Keep the person comfortable and monitor their breathing."
        ],
        "requires_hospital": True
    },
    {
        "category": "Critical",
        "disease_name": "Choking (Severe)",
        "description": "An obstruction of the airway by a foreign object, preventing breathing.",
        "symptoms": ["Inability to talk, cough, or breathe", "Clutching the throat (universal choking sign)", "Skin, lips, and nails turning blue or dusky"],
        "immediate_first_aid": [
            "If the person is coughing forcefully, encourage them to continue.",
            "If they cannot cough, speak, or breathe, call 112.",
            "Perform Heimlich maneuver (abdominal thrusts).",
            "If the person becomes unconscious, begin CPR."
        ],
        "requires_hospital": True
    },
    {
        "category": "Critical",
        "disease_name": "Seizure (Convulsive)",
        "description": "A sudden, uncontrolled electrical disturbance in the brain, causing changes in behavior, movements, or feelings.",
        "symptoms": ["Uncontrollable jerking movements", "Loss of consciousness", "Staring spell", "Confusion"],
        "immediate_first_aid": [
            "Ease the person to the floor and clear the area of hard or sharp objects.",
            "Place something soft under their head.",
            "Turn them gently onto one side to help keep the airway clear.",
            "Do not try to hold them down or put anything in their mouth.",
            "Call 112 if the seizure lasts longer than 5 minutes."
        ],
        "requires_hospital": True
    },
    {
        "category": "Critical",
        "disease_name": "Unconscious / Unresponsive",
        "description": "An individual who has completely lost consciousness and does not respond to voice or physical touch.",
        "symptoms": ["No response to shaking or shouting", "Limp body", "Possible abnormal breathing"],
        "immediate_first_aid": [
            "Call emergency services immediately.",
            "Check for breathing. If not breathing normally, start CPR.",
            "If breathing normally, place them in the recovery position (on their side).",
            "Monitor them continuously until help arrives."
        ],
        "requires_hospital": True
    },
    {
        "category": "Critical",
        "disease_name": "Severe Internal Bleeding",
        "description": "Bleeding that occurs inside the body, often due to blunt trauma, which can rapidly lead to shock.",
        "symptoms": ["Abdominal pain or swelling", "Vomiting blood", "Pale, cold, clammy skin", "Rapid, weak pulse", "Confusion or lethargy"],
        "immediate_first_aid": [
            "Call 112 immediately. This is a life-threatening emergency.",
            "Have the person lie down and elevate their legs if possible.",
            "Keep them warm with a blanket to prevent shock.",
            "Do not give them anything to eat or drink."
        ],
        "requires_hospital": True
    },
    {
        "category": "Critical",
        "disease_name": "Asthma Attack (Severe)",
        "description": "A sudden worsening of asthma symptoms caused by the tightening of muscles around the airways.",
        "symptoms": ["Severe wheezing", "Coughing that won't stop", "Very rapid breathing", "Difficulty talking", "Blue lips or fingernails"],
        "immediate_first_aid": [
            "Help the person sit upright and remain calm.",
            "Assist them in using their rescue inhaler (usually albuterol).",
            "If they don't have an inhaler or if symptoms don't improve after 5-10 minutes, call 112.",
            "Do not leave the person alone."
        ],
        "requires_hospital": True
    },
    {
        "category": "Critical",
        "disease_name": "Diabetic Emergency (Hypoglycemia)",
        "description": "Critically low blood sugar level that can lead to unconsciousness or seizures.",
        "symptoms": ["Shaking or trembling", "Sweating and chills", "Confusion or irritability", "Fainting or seizures"],
        "immediate_first_aid": [
            "If conscious and able to swallow, give them fast-acting sugar (fruit juice, non-diet soda, honey, or candy).",
            "If unconscious, do not put anything in their mouth.",
            "Call 112 immediately if they lose consciousness or if symptoms don't improve after 15 minutes of sugar intake."
        ],
        "requires_hospital": True
    },
    {
        "category": "Critical",
        "disease_name": "Sepsis",
        "description": "A life-threatening reaction to an infection that causes the immune system to attack the body's own tissues.",
        "symptoms": ["High heart rate", "Fever or shivering, or feeling very cold", "Confusion or disorientation", "Shortness of breath", "Extreme pain or discomfort"],
        "immediate_first_aid": [
            "Call 112 immediately and state you suspect sepsis.",
            "Keep the person comfortable and monitor their vitals.",
            "This requires immediate IV antibiotics at a hospital.",
            "Do not delay seeking medical help."
        ],
        "requires_hospital": True
    },
    {
        "category": "Critical",
        "disease_name": "Pulmonary Embolism",
        "description": "A blood clot that has traveled to the lungs, blocking blood flow and potentially causing heart failure.",
        "symptoms": ["Sudden shortness of breath", "Sharp chest pain that worsens with deep breathing", "Coughing up blood", "Rapid heart rate", "Dizziness"],
        "immediate_first_aid": [
            "Call 112 immediately.",
            "Have the person sit up or lie in a comfortable position.",
            "Keep them calm.",
            "Monitor breathing and be prepared to perform CPR if they stop breathing."
        ],
        "requires_hospital": True
    },
    {
        "category": "Critical",
        "disease_name": "Aneurysm Rupture",
        "description": "A burst blood vessel in the brain or aorta causing massive internal bleeding.",
        "symptoms": ["Sudden, extremely severe headache ('worst headache of my life')", "Nausea or vomiting", "Stiff neck", "Loss of consciousness", "Drooping eyelid"],
        "immediate_first_aid": [
            "Call 112 immediately.",
            "Keep the person as still as possible.",
            "Do not give them anything to eat or drink.",
            "Monitor their breathing."
        ],
        "requires_hospital": True
    },
    {
        "category": "Critical",
        "disease_name": "Meningitis (Acute)",
        "description": "Rapidly progressing inflammation of the membranes surrounding the brain and spinal cord, usually due to bacterial infection.",
        "symptoms": ["Sudden high fever", "Stiff neck", "Severe headache", "Confusion", "Seizures", "Sensitivity to light", "Skin rash (in some cases)"],
        "immediate_first_aid": [
            "Call 112 immediately. Bacterial meningitis is rapidly fatal.",
            "Keep the person isolated if possible as it can be contagious.",
            "Lower fever slightly with cool compresses, but focus on getting medical help."
        ],
        "requires_hospital": True
    },
    {
        "category": "Critical",
        "disease_name": "Status Epilepticus",
        "description": "A continuous seizure lasting more than 5 minutes, or two or more seizures without full recovery of consciousness between them.",
        "symptoms": ["Prolonged convulsions", "Lack of responsiveness for over 5 minutes"],
        "immediate_first_aid": [
            "Call 112 immediately.",
            "Clear the area of hazards and place something soft under their head.",
            "Turn them on their side to prevent choking.",
            "Note the exact time the seizure started to inform paramedics."
        ],
        "requires_hospital": True
    },
    {
        "category": "Critical",
        "disease_name": "Ectopic Pregnancy Rupture",
        "description": "A fertilized egg grows outside the uterus (usually in a fallopian tube) and ruptures, causing severe internal bleeding.",
        "symptoms": ["Sudden, severe pain in the abdomen or pelvis", "Shoulder pain (referred pain from internal bleeding)", "Weakness, dizziness, or fainting", "Vaginal bleeding"],
        "immediate_first_aid": [
            "Call 112 immediately.",
            "Have the patient lie flat and elevate their legs to treat shock.",
            "Do not give them anything to eat or drink."
        ],
        "requires_hospital": True
    },

    # --- TRAUMA ---
    {
        "category": "Trauma",
        "disease_name": "Severe Bleeding (Hemorrhage)",
        "description": "Rapid and significant loss of blood from an external wound that cannot be stopped easily.",
        "symptoms": ["Blood spurting from a wound", "Blood soaking through bandages", "Pooling of blood", "Pale, cold, or clammy skin (shock)"],
        "immediate_first_aid": [
            "Call emergency services immediately (112).",
            "Apply firm, direct pressure to the wound using a clean cloth or sterile bandage.",
            "Maintain pressure until help arrives.",
            "If on a limb and bleeding won't stop, apply a tourniquet 2-3 inches above the wound."
        ],
        "requires_hospital": True
    },
    {
        "category": "Trauma",
        "disease_name": "Fracture (Open/Compound)",
        "description": "A broken bone that pierces the skin, creating a risk of severe bleeding and infection.",
        "symptoms": ["Bone protruding through the skin", "Severe pain and swelling", "Inability to move the limb", "Bleeding"],
        "immediate_first_aid": [
            "Call emergency services immediately (112).",
            "Do NOT attempt to push the bone back in or realign it.",
            "Control any severe bleeding by applying pressure around (not directly over) the bone.",
            "Keep the limb as still as possible until help arrives."
        ],
        "requires_hospital": True
    },
    {
        "category": "Trauma",
        "disease_name": "Head Injury (Concussion/Bleed)",
        "description": "Trauma to the head or brain, ranging from a mild concussion to a severe traumatic brain injury.",
        "symptoms": ["Loss of consciousness", "Confusion or memory loss", "Vomiting", "Clear fluid leaking from ears or nose", "Unequal pupil size"],
        "immediate_first_aid": [
            "Call 112 immediately. Keep the person still.",
            "Do NOT move the person unless they are in immediate danger (to prevent spinal injury).",
            "Apply firm pressure to any bleeding wounds on the head, but be gentle if a skull fracture is suspected.",
            "Monitor breathing and be prepared to start CPR if necessary."
        ],
        "requires_hospital": True
    },
    {
        "category": "Trauma",
        "disease_name": "Burns (Severe / 3rd Degree)",
        "description": "Severe tissue damage caused by heat, chemicals, electricity. Third-degree burns destroy the epidermis and dermis.",
        "symptoms": ["Charred, black, white, or leathery skin", "Lack of pain in the burned area (due to nerve damage)", "Swelling"],
        "immediate_first_aid": [
            "Call emergency services immediately (112).",
            "Ensure the person is no longer in contact with the burning source.",
            "Do not remove burned clothing that is stuck to the skin.",
            "Cover the burn loosely with a sterile, non-stick bandage or clean cloth."
        ],
        "requires_hospital": True
    },
    {
        "category": "Trauma",
        "disease_name": "Spinal Injury",
        "description": "Damage to any part of the spinal cord or nerves at the end of the spinal canal, often from a high-impact collision or fall.",
        "symptoms": ["Extreme back pain or pressure in the neck, head or back", "Weakness, incoordination or paralysis in any part of the body", "Numbness, tingling or loss of sensation in hands, fingers, feet or toes"],
        "immediate_first_aid": [
            "Call 112 immediately.",
            "Do NOT move the person unless they are in immediate danger.",
            "Keep the person's head and neck in the position in which they were found. Place your hands on both sides of the head to keep it from moving.",
            "Do not attempt to straighten the neck."
        ],
        "requires_hospital": True
    },
    {
        "category": "Trauma",
        "disease_name": "Amputation",
        "description": "The traumatic severing of a body part, such as a finger, toe, arm, or leg.",
        "symptoms": ["Severed body part", "Massive bleeding", "Shock", "Severe pain"],
        "immediate_first_aid": [
            "Call 112 immediately.",
            "Control bleeding by applying direct pressure and elevating the injured area. Use a tourniquet if bleeding is uncontrollable.",
            "Recover the amputated part if possible. Rinse it with clean water, wrap it in a clean cloth, place it in a sealed plastic bag, and put that bag on ice (do not let the part directly touch the ice).",
            "Treat the person for shock."
        ],
        "requires_hospital": True
    },
    {
        "category": "Trauma",
        "disease_name": "Penetrating Chest Wound",
        "description": "An injury caused by an object piercing the chest wall, potentially causing a collapsed lung (pneumothorax).",
        "symptoms": ["Sucking sound coming from the chest wound", "Severe difficulty breathing", "Coughing up blood", "Cyanosis (blue lips/skin)"],
        "immediate_first_aid": [
            "Call 112 immediately.",
            "If there is an impaled object, DO NOT remove it. Bulky dressings should be placed around the object to stabilize it.",
            "If it's a sucking chest wound (no object), seal the wound with a plastic bag or sterile dressing taped on three sides to allow air to escape but not enter.",
            "Position the person sitting up if it helps them breathe, or lying on the injured side."
        ],
        "requires_hospital": True
    },
    {
        "category": "Trauma",
        "disease_name": "Crush Injury",
        "description": "Injury resulting from a body part being subjected to a high degree of force or pressure, often trapping the person.",
        "symptoms": ["Severe pain", "Swelling", "Paralysis of the trapped limb", "Signs of shock"],
        "immediate_first_aid": [
            "Call 112 immediately.",
            "If the person has been trapped for less than 15 minutes, attempt to free them if it's safe to do so.",
            "If they have been trapped for longer than 15 minutes, DO NOT remove the crushing object unless instructed by emergency services (due to risk of crush syndrome/toxic shock).",
            "Control any visible bleeding and treat for shock."
        ],
        "requires_hospital": True
    },
    {
        "category": "Trauma",
        "disease_name": "Eye Injury (Chemical or Trauma)",
        "description": "Damage to the eye caused by a foreign object, blunt force, or chemical splash.",
        "symptoms": ["Severe pain in the eye", "Visible foreign object or blood in the eye", "Changes in vision", "Tearing and redness"],
        "immediate_first_aid": [
            "For chemicals: Flush the eye immediately with continuous running tap water for at least 15-20 minutes. Call 112.",
            "For trauma/objects: Do NOT rub the eye. Do NOT attempt to remove an impaled object.",
            "Cover both eyes with a sterile dressing (to prevent eye movement) and seek emergency medical care."
        ],
        "requires_hospital": True
    },
    {
        "category": "Trauma",
        "disease_name": "Pelvic Fracture",
        "description": "A break in the bones of the pelvis, usually from high-energy trauma like a car crash or a fall from a height. High risk of massive internal bleeding.",
        "symptoms": ["Severe pain in the groin, hip or lower back", "Inability to walk or stand", "Bruising over the pelvic bones", "Shock"],
        "immediate_first_aid": [
            "Call 112 immediately.",
            "Do NOT move the person.",
            "Keep them warm and treat for shock.",
            "Do not press on the pelvis to check for stability."
        ],
        "requires_hospital": True
    },
    {
        "category": "Trauma",
        "disease_name": "Dislocated Joint",
        "description": "An injury where a bone is forced out of its normal position in a joint, commonly occurring in the shoulder, knee, or fingers.",
        "symptoms": ["Visibly deformed or out-of-place joint", "Swelling or discoloration", "Intense pain", "Inability to move the joint"],
        "immediate_first_aid": [
            "Do NOT try to pop the joint back into place (this can damage blood vessels or nerves).",
            "Immobilize the joint in the position you found it using a splint or sling.",
            "Apply ice to reduce swelling.",
            "Seek medical attention."
        ],
        "requires_hospital": True
    },
    {
        "category": "Trauma",
        "disease_name": "Traumatic Pneumothorax (Collapsed Lung)",
        "description": "Air leaking into the space between the lung and chest wall, often from blunt trauma like a steering wheel impact.",
        "symptoms": ["Sudden sharp chest pain", "Shortness of breath", "Tightness in the chest", "Rapid heart rate", "Fatigue"],
        "immediate_first_aid": [
            "Call 112 immediately.",
            "Help the person sit up to make breathing easier.",
            "Monitor breathing and wait for emergency services."
        ],
        "requires_hospital": True
    },
    {
        "category": "Trauma",
        "disease_name": "Laceration with Arterial Bleeding",
        "description": "A deep cut severing a major artery, resulting in rapid, high-pressure blood loss.",
        "symptoms": ["Bright red blood", "Blood spurting rhythmically with the heartbeat", "Rapid pooling of blood", "Signs of shock"],
        "immediate_first_aid": [
            "Call 112 immediately.",
            "Apply maximum, continuous direct pressure to the wound with a clean cloth.",
            "If on a limb and bleeding won't stop, apply a tourniquet HIGH and TIGHT above the wound.",
            "Write the time the tourniquet was applied on the patient's forehead if possible."
        ],
        "requires_hospital": True
    },
    {
        "category": "Trauma",
        "disease_name": "Flail Chest",
        "description": "A life-threatening condition where a segment of the rib cage breaks due to trauma and becomes detached from the rest of the chest wall.",
        "symptoms": ["Paradoxical chest movement (part of the chest moves in during inhalation and out during exhalation)", "Severe pain", "Difficulty breathing"],
        "immediate_first_aid": [
            "Call 112 immediately.",
            "Place the patient in a position of comfort, usually sitting up.",
            "Place a bulky dressing (like a folded towel) over the flail segment and tape it down securely to stabilize the ribs.",
            "Monitor breathing closely."
        ],
        "requires_hospital": True
    },

    # --- ENVIRONMENTAL ---
    {
        "category": "Environmental",
        "disease_name": "Anaphylaxis (Severe Allergic Reaction)",
        "description": "A severe, life-threatening allergic reaction that can occur within seconds or minutes of exposure to an allergen (food, insect sting, medication).",
        "symptoms": ["Swelling of the lips, tongue, or throat", "Difficulty breathing or wheezing", "Hives or skin rash", "Dizziness or fainting"],
        "immediate_first_aid": [
            "Call emergency services immediately (112).",
            "Ask if they have an epinephrine auto-injector (EpiPen) and help them use it.",
            "Have the person lie down on their back. If breathing is difficult, sitting up may be better.",
            "If breathing stops, begin CPR."
        ],
        "requires_hospital": True
    },
    {
        "category": "Environmental",
        "disease_name": "Poisoning or Overdose",
        "description": "Exposure to a harmful substance by swallowing, inhaling, injecting, or absorbing it through the skin.",
        "symptoms": ["Vomiting or nausea", "Difficulty breathing", "Drowsiness or altered mental state", "Seizures", "Burns around the mouth"],
        "immediate_first_aid": [
            "Call emergency services (112) or Poison Control immediately.",
            "Try to identify the poison or drug and keep the container.",
            "Do not induce vomiting unless told to do so by medical professionals.",
            "If unconscious but breathing, place them on their side."
        ],
        "requires_hospital": True
    },
    {
        "category": "Environmental",
        "disease_name": "Heat Stroke",
        "description": "A condition caused by your body overheating, usually as a result of prolonged exposure to or physical exertion in high temperatures.",
        "symptoms": ["High body temperature (103°F/39.4°C+)", "Hot, red, dry skin", "Fast, strong pulse", "Confusion or loss of consciousness"],
        "immediate_first_aid": [
            "Call emergency services immediately (112) - Heat stroke is a medical emergency.",
            "Move the person to a cooler place (shade or air conditioning).",
            "Help lower their temperature with cool cloths or a cool bath.",
            "Do not give them anything to drink if they are not fully conscious."
        ],
        "requires_hospital": True
    },
    {
        "category": "Environmental",
        "disease_name": "Hypothermia",
        "description": "A medical emergency that occurs when your body loses heat faster than it can produce heat, causing a dangerously low body temperature.",
        "symptoms": ["Shivering", "Slurred speech", "Slow, shallow breathing", "Clumsiness", "Confusion"],
        "immediate_first_aid": [
            "Call emergency services immediately (112).",
            "Move the person to a warm, dry location and remove any wet clothing.",
            "Wrap them in blankets, focusing on the center of their body.",
            "Give them warm, sweet, non-alcoholic drinks if they are fully conscious."
        ],
        "requires_hospital": True
    },
    {
        "category": "Environmental",
        "disease_name": "Snake Bite (Venomous)",
        "description": "A bite from a venomous snake that injects toxin into the body.",
        "symptoms": ["Two puncture wounds", "Severe pain, redness, and swelling", "Nausea, vomiting, sweating", "Difficulty breathing"],
        "immediate_first_aid": [
            "Call emergency services immediately (112).",
            "Keep the person calm and still to slow the spread of venom.",
            "Position the bite at or below the level of the heart.",
            "Do NOT cut the wound, attempt to suck out venom, or apply a tourniquet/ice."
        ],
        "requires_hospital": True
    },
    {
        "category": "Environmental",
        "disease_name": "Drowning / Near-Drowning",
        "description": "Respiratory impairment from being in or under a liquid.",
        "symptoms": ["Unconsciousness", "Not breathing or gasping", "Blue lips and skin", "Coughing up pink, frothy sputum"],
        "immediate_first_aid": [
            "Get the person out of the water immediately.",
            "Call emergency services (112).",
            "Check for breathing. If they are not breathing, begin CPR immediately.",
            "Continue CPR until they breathe or medical help takes over."
        ],
        "requires_hospital": True
    },
    {
        "category": "Environmental",
        "disease_name": "Carbon Monoxide Poisoning",
        "description": "Inhalation of carbon monoxide gas, an odorless, colorless gas that can cause sudden illness and death.",
        "symptoms": ["Dull headache", "Weakness", "Dizziness", "Nausea or vomiting", "Shortness of breath", "Confusion", "Loss of consciousness"],
        "immediate_first_aid": [
            "Get the person to fresh air immediately. Open doors and windows, turn off combustion appliances and leave the house.",
            "Call 112 immediately.",
            "If the person is unconscious and not breathing, begin CPR."
        ],
        "requires_hospital": True
    },
    {
        "category": "Environmental",
        "disease_name": "Electrocution",
        "description": "Injury or death caused by electric shock passing through the body.",
        "symptoms": ["Severe burns at the site of contact", "Confusion or loss of consciousness", "Difficulty breathing or cardiac arrest", "Muscle spasms"],
        "immediate_first_aid": [
            "Do NOT touch the person if they are still in contact with the electrical current.",
            "Turn off the source of electricity if possible. If not, use a dry, non-conducting object made of cardboard, plastic or wood to move the source away.",
            "Call 112 immediately.",
            "Once safe, check for breathing and a pulse. Begin CPR if necessary."
        ],
        "requires_hospital": True
    },
    {
        "category": "Environmental",
        "disease_name": "Frostbite",
        "description": "An injury caused by freezing of the skin and underlying tissues. Most common on fingers, toes, nose, ears, cheeks and chin.",
        "symptoms": ["Cold skin and a prickling feeling", "Numbness", "Red, white, bluish-white or grayish-yellow skin", "Hard or waxy-looking skin"],
        "immediate_first_aid": [
            "Get out of the cold.",
            "Gently warm the area in warm (not hot) water for 15 to 30 minutes.",
            "Do NOT rub the frostbitten area or walk on frostbitten feet/toes.",
            "Do NOT use a heating pad, heat lamp, or the heat of a stove, fireplace, or radiator for warming.",
            "Seek medical attention."
        ],
        "requires_hospital": True
    },
    {
        "category": "Environmental",
        "disease_name": "Jellyfish Sting",
        "description": "Stings from jellyfish tentacles containing venomous nematocysts.",
        "symptoms": ["Burning, prickling, stinging pain", "Red, brown or purplish tracks on the skin", "Itching", "Swelling"],
        "immediate_first_aid": [
            "Rinse the area with vinegar for at least 30 seconds to deactivate stingers (or seawater if vinegar isn't available). Do NOT use fresh water.",
            "Remove tentacles with tweezers or a gloved hand.",
            "Soak the area in hot water (110-113°F) for 20-45 minutes.",
            "Seek emergency care if there's difficulty breathing, severe pain, or if the sting covers a large area."
        ],
        "requires_hospital": False
    },
    {
        "category": "Environmental",
        "disease_name": "Black Widow / Recluse Spider Bite",
        "description": "Bites from highly venomous spiders resulting in systemic or necrotic reactions.",
        "symptoms": ["Two small puncture marks", "Muscle cramping (Widow)", "Increasing pain and a blister forming a bullseye (Recluse)", "Fever or chills"],
        "immediate_first_aid": [
            "Wash the bite area with soap and water.",
            "Apply a cold compress to reduce swelling.",
            "Keep the bitten limb elevated.",
            "Seek emergency medical attention immediately. Do NOT cut the wound or try to suck venom."
        ],
        "requires_hospital": True
    },
    {
        "category": "Environmental",
        "disease_name": "Rabies Exposure (Animal Bite)",
        "description": "A bite from a wild or unvaccinated animal carrying the rabies virus, which is 100% fatal if left untreated before symptoms start.",
        "symptoms": ["Puncture wound from an animal bite", "Pain or numbness at the bite site", "Anxiety, confusion (late stages)"],
        "immediate_first_aid": [
            "Scrub the wound immediately and vigorously with soap and large amounts of water for 15 minutes.",
            "Apply an antiseptic like povidone-iodine if available.",
            "Go to the emergency room immediately for rabies Post-Exposure Prophylaxis (PEP) vaccines."
        ],
        "requires_hospital": True
    },
    {
        "category": "Environmental",
        "disease_name": "High Altitude Pulmonary Edema (HAPE)",
        "description": "Fluid accumulation in the lungs caused by traveling to high altitudes too rapidly.",
        "symptoms": ["Extreme shortness of breath even at rest", "Coughing up pink, frothy sputum", "Chest tightness", "Fatigue or weakness", "Blue skin/lips"],
        "immediate_first_aid": [
            "Descend to a lower altitude immediately (this is life-saving).",
            "Provide supplemental oxygen if available.",
            "Keep the person warm and at rest.",
            "Seek emergency medical care."
        ],
        "requires_hospital": True
    },
    {
        "category": "Environmental",
        "disease_name": "Chemical Ingestion (Household Cleaners)",
        "description": "Accidental or intentional swallowing of toxic household chemicals like bleach or drain cleaner.",
        "symptoms": ["Burns on the lips or mouth", "Drooling", "Severe throat pain", "Vomiting", "Difficulty breathing"],
        "immediate_first_aid": [
            "Do NOT induce vomiting (acids/alkalis will burn the throat again on the way up).",
            "Do NOT give water or milk unless instructed by Poison Control.",
            "Call 112 and Poison Control immediately.",
            "Bring the chemical container to the hospital."
        ],
        "requires_hospital": True
    },

    # --- MINOR ---
    {
        "category": "Minor",
        "disease_name": "Common Cold",
        "description": "A viral infection of the nose and throat (upper respiratory tract). It's usually harmless, although it might not feel that way.",
        "symptoms": ["Runny or stuffy nose", "Sore throat", "Cough", "Congestion", "Slight body aches or a mild headache"],
        "immediate_first_aid": [
            "Get plenty of rest.",
            "Drink warm fluids like tea, broth, or warm water with lemon and honey.",
            "Use over-the-counter pain relievers or cold medicines for symptom relief.",
            "Gargle with warm saltwater for a sore throat."
        ],
        "requires_hospital": False
    },
    {
        "category": "Minor",
        "disease_name": "Influenza (Flu)",
        "description": "A viral infection that attacks your respiratory system. It comes on suddenly and is generally more severe than a cold.",
        "symptoms": ["Fever over 100.4°F (38°C)", "Aching muscles", "Chills and sweats", "Headache", "Dry, persistent cough", "Fatigue"],
        "immediate_first_aid": [
            "Rest completely.",
            "Drink plenty of liquids (water, juice, warm soups) to prevent dehydration.",
            "Take over-the-counter medications like acetaminophen or ibuprofen to lower fever and relieve muscle aches.",
            "Consult a doctor if symptoms are severe or if you are in a high-risk group."
        ],
        "requires_hospital": False
    },
    {
        "category": "Minor",
        "disease_name": "Fever",
        "description": "A temporary increase in average body temperature, often due to an illness or infection.",
        "symptoms": ["Elevated temperature", "Sweating", "Chills and shivering", "Headache", "Muscle aches", "Loss of appetite"],
        "immediate_first_aid": [
            "Drink plenty of fluids to stay hydrated.",
            "Rest to help your body fight the infection.",
            "Take over-the-counter fever reducers like acetaminophen or ibuprofen if uncomfortable.",
            "Keep the room temperature cool and wear lightweight clothing."
        ],
        "requires_hospital": False
    },
    {
        "category": "Minor",
        "disease_name": "Viral Infection (General)",
        "description": "An infection caused by a virus. They can affect various parts of the body and symptoms vary widely.",
        "symptoms": ["Fever", "Fatigue", "Muscle aches", "Cough", "Sore throat", "Diarrhea or vomiting (depending on the virus)"],
        "immediate_first_aid": [
            "Rest and allow your immune system to fight the virus.",
            "Stay well-hydrated.",
            "Use over-the-counter medications to manage specific symptoms (like pain relievers for aches).",
            "Seek medical advice if symptoms worsen significantly or don't improve after several days."
        ],
        "requires_hospital": False
    },
    {
        "category": "Minor",
        "disease_name": "Minor Cut or Scrape",
        "description": "A superficial injury to the skin, causing minor bleeding and minimal tissue damage.",
        "symptoms": ["Bleeding", "Pain at the site", "Redness", "Scraped skin"],
        "immediate_first_aid": [
            "Wash your hands before treating the wound.",
            "Stop any bleeding by applying gentle pressure with a clean cloth.",
            "Clean the wound by rinsing it under clear running water. Wash around the wound with soap.",
            "Apply an antibiotic ointment or petroleum jelly.",
            "Cover the wound with a bandage."
        ],
        "requires_hospital": False
    },
    {
        "category": "Minor",
        "disease_name": "Minor Burn (1st Degree)",
        "description": "A superficial burn affecting only the outer layer of skin, usually from hot liquids, brief contact with a hot object, or sunburn.",
        "symptoms": ["Redness", "Pain", "Minor swelling", "No blisters"],
        "immediate_first_aid": [
            "Cool the burn immediately under cool (not ice-cold) running water for 10-15 minutes.",
            "Remove rings or tight items from the burned area before it swells.",
            "Apply a soothing lotion containing aloe vera.",
            "Take an over-the-counter pain reliever if needed.",
            "Do NOT pop any blisters if they do form."
        ],
        "requires_hospital": False
    },
    {
        "category": "Minor",
        "disease_name": "Sprain or Strain",
        "description": "A sprain is a stretching or tearing of ligaments. A strain is a stretching or tearing of muscle or tendon.",
        "symptoms": ["Pain", "Swelling", "Bruising", "Limited ability to move the affected joint", "Hearing or feeling a 'pop' in your joint at the time of injury"],
        "immediate_first_aid": [
            "Follow the R.I.C.E. method.",
            "Rest the injured area.",
            "Ice the area for 15-20 minutes every 2-3 hours for the first couple of days.",
            "Compress the area with an elastic wrap or bandage to reduce swelling.",
            "Elevate the injured area above the level of your heart, especially at night."
        ],
        "requires_hospital": False
    },
    {
        "category": "Minor",
        "disease_name": "Nosebleed",
        "description": "Bleeding from the blood vessels in the nose, common and usually not serious.",
        "symptoms": ["Bleeding from one or both nostrils", "Sensation of fluid flowing down the back of the throat"],
        "immediate_first_aid": [
            "Sit upright and lean slightly forward (do NOT lean back, to avoid swallowing blood).",
            "Pinch the soft part of your nose firmly against your facial bones.",
            "Breathe through your mouth.",
            "Hold the pressure continuously for 10 to 15 minutes.",
            "Apply a cold compress or ice pack across the bridge of your nose."
        ],
        "requires_hospital": False
    },
    {
        "category": "Minor",
        "disease_name": "Bee Sting",
        "description": "A sting from a bee, usually causing localized pain and swelling, but can trigger anaphylaxis in allergic individuals.",
        "symptoms": ["Instant, sharp burning pain", "A red welt at the sting area", "Slight swelling around the area"],
        "immediate_first_aid": [
            "Remove the stinger immediately by scraping it with a fingernail or the edge of a credit card (don't pinch it).",
            "Wash the area with soap and water.",
            "Apply a cold compress or ice pack to reduce swelling.",
            "Take an over-the-counter pain reliever or antihistamine for pain and itching."
        ],
        "requires_hospital": False
    },
    {
        "category": "Minor",
        "disease_name": "Sunburn",
        "description": "Red, painful skin that feels hot to the touch, usually appearing within a few hours after too much exposure to ultraviolet (UV) light.",
        "symptoms": ["Pinkness or redness", "Skin that feels warm or hot to the touch", "Pain, tenderness and itching", "Swelling", "Small fluid-filled blisters (in severe cases)"],
        "immediate_first_aid": [
            "Get out of the sun.",
            "Take a cool bath or shower.",
            "Apply a moisturizer, lotion or gel containing aloe vera.",
            "Drink extra water.",
            "Take an over-the-counter pain reliever to help with discomfort and swelling.",
            "Do not pop blisters."
        ],
        "requires_hospital": False
    },
    {
        "category": "Minor",
        "disease_name": "Dehydration (Mild to Moderate)",
        "description": "A condition occurring when the body loses more fluids than it takes in.",
        "symptoms": ["Excessive thirst", "Dry mouth", "Decreased urination", "Dark yellow urine", "Headache", "Muscle cramps"],
        "immediate_first_aid": [
            "Move to a cool, shaded area.",
            "Drink water or oral rehydration solutions (ORS) with electrolytes in small, frequent sips.",
            "Remove excess clothing to cool down.",
            "If vomiting prevents drinking, or if confusion occurs, seek emergency care."
        ],
        "requires_hospital": False
    },
    {
        "category": "Minor",
        "disease_name": "Splinter / Foreign Object in Skin",
        "description": "A small piece of wood, glass, or metal embedded just under the surface of the skin.",
        "symptoms": ["A visible dot or line under the skin", "Pain when pressing on the area", "Redness or swelling"],
        "immediate_first_aid": [
            "Wash your hands and the affected area with soap and water.",
            "Sterilize a needle and tweezers with rubbing alcohol.",
            "Use the needle to gently break the skin over the splinter, then use tweezers to pull it out at the same angle it entered.",
            "Wash the area again and apply an antibiotic ointment and bandage."
        ],
        "requires_hospital": False
    },
    {
        "category": "Minor",
        "disease_name": "Muscle Cramp (Charley Horse)",
        "description": "A sudden, involuntary contraction of one or more muscles, often in the leg.",
        "symptoms": ["Sudden, sharp pain in a muscle", "A hard lump of muscle tissue that you can feel or see beneath the skin"],
        "immediate_first_aid": [
            "Stop the activity that caused the cramp.",
            "Gently stretch and massage the cramping muscle.",
            "Apply heat to tense/tight muscles, or cold to sore/tender muscles.",
            "Drink water or a sports drink to replenish electrolytes."
        ],
        "requires_hospital": False
    },
    {
        "category": "Minor",
        "disease_name": "Tension Headache",
        "description": "The most common type of headache, characterized by mild to moderate pain feeling like a tight band around the head.",
        "symptoms": ["Dull, aching head pain", "Sensation of tightness or pressure across the forehead or on the sides and back of the head", "Tenderness on scalp, neck and shoulder muscles"],
        "immediate_first_aid": [
            "Rest in a quiet, dark room.",
            "Apply a hot or cold compress to the head or neck.",
            "Gently massage the head, neck, and shoulders.",
            "Take over-the-counter pain relievers such as ibuprofen or acetaminophen."
        ],
        "requires_hospital": False
    }
]

async def seed():
    # Make sure tables are created
    async with engine.begin() as conn:
        # Drop the table if it exists so we can recreate it with the new schema
        await conn.execute(text("DROP TABLE IF EXISTS disease_dataset"))
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # For sqlite, we can just clear the table and insert
        await session.execute(text("DELETE FROM disease_dataset"))
        
        for data in COMMON_EMERGENCIES:
            new_disease = DiseaseDataset(**data)
            session.add(new_disease)
        
        await session.commit()
        logger.info(f"Successfully seeded {len(COMMON_EMERGENCIES)} categorized diseases into the database.")

if __name__ == "__main__":
    asyncio.run(seed())
