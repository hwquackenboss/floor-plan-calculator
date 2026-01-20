function getFloorCheckboxes(floorPrefix) {
            const specialAreas = [];
            const unfinishedRooms = [];

            // Special areas
             // Special areas - check if element exists before accessing it
            const atticCheckbox = document.getElementById(`${floorPrefix}-attic`);
            const openBelowCheckbox = document.getElementById(`${floorPrefix}-open-below`);
            
            if (atticCheckbox && atticCheckbox.checked) specialAreas.push('the attic');
            if (openBelowCheckbox && openBelowCheckbox.checked) specialAreas.push('the open to below areas');
            if (document.getElementById(`${floorPrefix}-under-five`).checked) specialAreas.push('areas under five feet in height');
            if (document.getElementById(`${floorPrefix}-crawlspace`).checked) specialAreas.push('the crawlspace');
            if (document.getElementById(`${floorPrefix}-shed`).checked) specialAreas.push('the shed');

            // Unfinished rooms
            if (document.getElementById(`${floorPrefix}-porch`).checked) unfinishedRooms.push('the porch');
            if (document.getElementById(`${floorPrefix}-utility`).checked) unfinishedRooms.push('the utility room');
            if (document.getElementById(`${floorPrefix}-laundry`).checked) unfinishedRooms.push('the laundry room');
            if (document.getElementById(`${floorPrefix}-storage`).checked) unfinishedRooms.push('the storage room');
            if (document.getElementById(`${floorPrefix}-utility-laundry`).checked) unfinishedRooms.push('the utility/laundry room');
            if (document.getElementById(`${floorPrefix}-utility-storage`).checked) unfinishedRooms.push('the utility/storage room');
            if (document.getElementById(`${floorPrefix}-laundry-storage`).checked) unfinishedRooms.push('the laundry/storage room');
            if (document.getElementById(`${floorPrefix}-entry`).checked) unfinishedRooms.push('the entry');
            if (document.getElementById(`${floorPrefix}-other`).checked) unfinishedRooms.push('other unfinished areas');

            return { specialAreas, unfinishedRooms };
        }

        function generateTemplate() {
            // Get all input values
            const floors = {
                main: {
                    total: parseFloat(document.getElementById('main-total').value) || 0,
                    noGarage: parseFloat(document.getElementById('main-no-garage').value) || 0,
                    noSpecials: parseFloat(document.getElementById('main-no-specials').value) || 0,
                    finished: parseFloat(document.getElementById('main-finished').value) || 0
                },
                upper: {
                    total: parseFloat(document.getElementById('upper-total').value) || 0,
                    noGarage: parseFloat(document.getElementById('upper-total').value) || 0, // Same as total for upper
                    noSpecials: parseFloat(document.getElementById('upper-no-specials').value) || 0,
                    finished: parseFloat(document.getElementById('upper-finished').value) || 0
                },
                top: {
                    total: parseFloat(document.getElementById('top-total').value) || 0,
                    noGarage: parseFloat(document.getElementById('top-total').value) || 0, // Same as total for top
                    noSpecials: parseFloat(document.getElementById('top-no-specials').value) || 0,
                    finished: parseFloat(document.getElementById('top-finished').value) || 0
                },
                lower: {
                    total: parseFloat(document.getElementById('lower-total').value) || 0,
                    noGarage: parseFloat(document.getElementById('lower-no-garage').value) || 0,
                    noSpecials: parseFloat(document.getElementById('lower-no-specials').value) || 0,
                    finished: parseFloat(document.getElementById('lower-finished').value) || 0
                }
            };

            const detachedGarage = parseFloat(document.getElementById('detached-garage').value) || 0;
            const detachedGarageDoor = document.getElementById('detached-garage-door').value || "";
            const attachedGarageDoorMain = document.getElementById('main-attached-garage-door').value || "";
            const attachedGarageDoorLower = document.getElementById('lower-attached-garage-door').value || "";
            const garageDimensions = document.getElementById('garage-dimensions').value || 0;
            const externalBuildings = parseFloat(document.getElementById('external-buildings').value) || 0;
            const internalWallsChecked = document.getElementById('internal-walls').checked;

            // Get checkboxes for each floor
            const mainCheckboxes = getFloorCheckboxes('main');
            const upperCheckboxes = getFloorCheckboxes('upper');
            const topCheckboxes = getFloorCheckboxes('top');
            const lowerCheckboxes = getFloorCheckboxes('lower');

            // Calculate totals
            const totalAllFloorsNoGarage = floors.main.noGarage + floors.upper.noGarage + floors.top.noGarage + floors.lower.noGarage;
            const aboveGroundTotal = floors.main.noSpecials + floors.upper.noSpecials + floors.top.noSpecials;
            const belowGroundTotal = floors.lower.noSpecials;
            const mainFloorTotal = floors.main.noSpecials;
            
            // Calculate garage total (difference between total and no-garage for main and lower)
            const mainGarage = floors.main.total - floors.main.noGarage;
            const lowerGarage = floors.lower.total - floors.lower.noGarage;
            const attachedGarageTotal = mainGarage + lowerGarage;
            const totalGarage = attachedGarageTotal + detachedGarage;
            
            const aboveGrdFinSqFt = floors.main.finished + floors.upper.finished + floors.top.finished;
            const belowGrdFinSqFt = floors.lower.finished;
            const totalFinSqFt = aboveGrdFinSqFt + belowGrdFinSqFt;

            // Find lowest floor for foundation calculation
            let foundationSqFt = 0;
            if (floors.lower.noGarage > 0) foundationSqFt = floors.lower.noGarage;
            else if (floors.main.noGarage > 0) foundationSqFt = floors.main.noGarage;

            // Generate floor descriptions with exclusions
            function generateFloorDescription(floorName, floorData, hasGarage, specialAreas, unfinishedRooms) {
                if (floorData.total === 0) return '';
                
                let description = `${floorName} level - Approx. ${floorData.total} sq. ft. This includes all areas of the ${floorName.toLowerCase()} level.`;
                
                const exclusions = [];
                
                // Add garage exclusion if present
                if (hasGarage && floorData.noGarage !== floorData.total) {
                    exclusions.push('garage');
                    description += ` Approx. ${floorData.noGarage} sq. ft. This includes all areas of the ${floorName.toLowerCase()} level excluding the garage.`;
                }
                
                // Add special areas exclusion if present
                if (specialAreas.length > 0 && floorData.noSpecials !== floorData.noGarage) {
                    exclusions.push(...specialAreas);
                    const exclusionText = exclusions.length === 1 ? exclusions[0] : 
                        exclusions.slice(0, -1).join(', ') + ' and ' + exclusions[exclusions.length - 1];
                    description += ` Approx. ${floorData.noSpecials} sq. ft. This includes all areas of the ${floorName.toLowerCase()} level excluding the ${exclusionText}.`;
                }
                
                // Add unfinished rooms exclusion if present
                if (unfinishedRooms.length > 0 && floorData.finished !== floorData.noSpecials) {
                    exclusions.push(...unfinishedRooms);
                    const exclusionText = exclusions.length === 1 ? exclusions[0] : 
                        exclusions.slice(0, -1).join(', ') + ' and ' + exclusions[exclusions.length - 1];
                    description += ` Approx. ${floorData.finished} sq. ft. This includes all areas of the ${floorName.toLowerCase()} level excluding the ${exclusionText}.`;
                }
                
                return description;
            }

            // Generate template
            let template = `Thank you for your order.

I got the following measurements:

`;

            // Add floor descriptions
            if (floors.main.total > 0) {
                const mainGaragePresent = floors.main.total > floors.main.noGarage;
                template += generateFloorDescription('Main', floors.main, mainGaragePresent, 
                    mainCheckboxes.specialAreas, mainCheckboxes.unfinishedRooms) + '\n\n';
            }
            if (floors.upper.total > 0) {
                template += generateFloorDescription('Upper', floors.upper, false, 
                    upperCheckboxes.specialAreas, upperCheckboxes.unfinishedRooms) + '\n\n';
            }
            if (floors.top.total > 0) {
                template += generateFloorDescription('Top', floors.top, false, 
                    topCheckboxes.specialAreas, topCheckboxes.unfinishedRooms) + '\n\n';
            }
            if (floors.lower.total > 0) {
                const lowerGaragePresent = floors.lower.total > floors.lower.noGarage;
                template += generateFloorDescription('Lower', floors.lower, lowerGaragePresent, 
                    lowerCheckboxes.specialAreas, lowerCheckboxes.unfinishedRooms) + '\n\n';
            }

            let internalWallsNote = '';
            if (internalWallsChecked) {
                internalWallsNote = `**PLEASE NOTE ALL MEASUREMENTS WERE CALCULATED FROM THE INSIDE WALLS OF THE LISTING**\n\n`;
            }

            template += `\n${internalWallsNote}
Approx. ${totalAllFloorsNoGarage} sq. ft. This includes all areas of all levels excluding the garage.\n
Above Ground Total Square Footage - Approx. ${aboveGroundTotal} sq. ft. \n
Below Ground Total Square Footage - Approx. ${belowGroundTotal} sq. ft. \n
Main Floor Total Square Footage - Approx. ${mainFloorTotal} sq. ft. \n\n\n`;

            if (totalGarage > 0) {
                template += `Garage Square Feet - Approx. ${totalGarage} sq. ft.\n\n`;
            }
            
            if (totalGarage > 0) { 
                if (detachedGarageDoor) {
                    template += `\nGarage Door Detached - ${detachedGarageDoor}`
                }
                if (attachedGarageDoorMain) {
                    template += `\nGarage Door Attached (Main) - ${attachedGarageDoorMain}`
                }
                if (attachedGarageDoorLower) {
                    template += `\nGarage Door Attached (Lower) - ${attachedGarageDoorLower}`
                }
            }
            
            if (detachedGarage > 0) {
                template += `\n\nGarage dimensions - ${garageDimensions}`;
            }
            
            template += `\n\nFoundation - Approx. ${foundationSqFt} sq. ft.

Above Grd Fin Sq Ft - Approx. ${aboveGrdFinSqFt} sq. ft.

Below Grd Fin Sq Ft - Approx. ${belowGrdFinSqFt} sq. ft.

Total Fin Sq Ft - Approx. ${totalFinSqFt} sq. ft.\n

Please review the above information and advise of anything that should be adjusted.

Please let me know also if there are any changes you would like made to the floor plan. I have attached the PDF of the floor plan.

Thank you for your business!`;

            // Display result
            document.getElementById('template-result').textContent = template;
            document.getElementById('output').style.display = 'block';
            document.getElementById('output').scrollIntoView({ behavior: 'smooth' });
        }

        function copyToClipboard() {
            const text = document.getElementById('template-result').textContent;
            navigator.clipboard.writeText(text).then(function() {
                const btn = document.querySelector('.copy-btn');
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                btn.style.background = '#rgb(34, 34, 34)';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '#rgb(34, 34, 34)';
                }, 2000);
            });
        }

        // function openGmail() {
        //     const text = document.getElementById('template-result').textContent;
        //     const encodedText = encodeURIComponent(text);
        //     const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&body=${encodedText}`;
        //     window.open(gmailUrl, '_blank');
        // }

        function openGmail() {
            const text = document.getElementById('template-result').textContent;
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&body=${encodeURIComponent(text)}`;
            window.open(gmailUrl, 'gmail_compose');
        }

        function clearAllFields() {
            // Clear all number inputs
            const numberInputs = document.querySelectorAll('input[type="number"]');
            numberInputs.forEach(input => {
                input.value = '';
            });
            
            // Clear all text inputs
            const textInputs = document.querySelectorAll('input[type="text"]');
            textInputs.forEach(input => {
                input.value = '';
            });
            
            // Uncheck all checkboxes
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Hide the output section
            document.getElementById('output').style.display = 'none';
            
            // Show a brief confirmation
            const clearBtn = document.querySelector('.clear-btn');
            const originalText = clearBtn.textContent;
            clearBtn.textContent = 'Cleared!';
            setTimeout(() => {
                clearBtn.textContent = originalText;
            }, 2000);
        }