
const STAT_VALUE_MIN = 0;
const STAT_VALUE_MAX = 99;

const STAT_STRENGTH = 0;
const STAT_DEXTERITY = 1;
const STAT_INTELLIGENCE = 2;
const STAT_FAITH = 3;
const STAT_ARCANE = 4;

const DAMAGE_PHYSICAL = 0;
const DAMAGE_MAGIC = 1;
const DAMAGE_FIRE = 2;
const DAMAGE_LIGHTNING = 3;
const DAMAGE_ARCANE = 4;

const SPELL_TYPE_ALL = 0;
const SPELL_TYPE_SORCERY = 1;
const SPELL_TYPE_INCANTATION = 2;

const SORT_NAME = 0;
const SORT_SCALING = 1;
const SORT_SCALING_ADJUSTED = 2;

class spellToolComparer
{
    spellSchools = [
        {
            name: "Stonedigger",
            type: SPELL_TYPE_SORCERY
        },
        {
            name: "Full Moon",
            type: SPELL_TYPE_SORCERY
        },
        {
            name: "Carian Sword",
            type: SPELL_TYPE_SORCERY
        },
        {
            name: "Invisibility",
            type: SPELL_TYPE_SORCERY
        },
        {
            name: "Gravity",
            type: SPELL_TYPE_SORCERY
        },
        {
            name: "Crystalian",
            type: SPELL_TYPE_SORCERY
        },
        {
            name: "Thorn",
            type: SPELL_TYPE_SORCERY
        },
        {
            name: "Death",
            type: SPELL_TYPE_SORCERY
        },
        {
            name: "Glintblade",
            type: SPELL_TYPE_SORCERY
        },
        {
            name: "Lava",
            type: SPELL_TYPE_SORCERY,
        },
        {
            name: "Golden Order",
            type: SPELL_TYPE_INCANTATION
        },
        {
            name: "Dragon Cult",
            type: SPELL_TYPE_INCANTATION
        },
        {
            name: "Fire Monk/Giant",
            type: SPELL_TYPE_INCANTATION
        },
        {
            name: "Bestial",
            type: SPELL_TYPE_INCANTATION
        },
        {
            name: "Frenzied Flame",
            type: SPELL_TYPE_INCANTATION
        },
        {
            name: "Dragon Communion",
            type: SPELL_TYPE_INCANTATION
        },
        {
            name: "Godskin Apostle",
            type: SPELL_TYPE_INCANTATION
        },
    ];

    updateOnChange = true;  // Disabled temporarily when modifying input fields without user intervention
    configuration = {
        weaponLevels : {
            regular: 25,
            somber: 10
        },
        sort : SORT_SCALING_ADJUSTED,
        filter : SPELL_TYPE_ALL,
        stats: [
            {
                name: "strength",
                value: 10
            },
            {
                name: "dexterity",
                value: 10
            },
            {
                name: "intelligence",
                value: 10
            },
            {
                name: "faith",
                value: 10
            },
            {
                name: "arcane",
                value: 10
            }
        ]
    };

    getScalingMapByID(aMapID)
    {
        for (var i = 0; i < statScalingMap.length; i++)
        {
            if (statScalingMap[i].id == aMapID)
            {
                return statScalingMap[i];
            }
        }
    }

    isToolScaledByStat(aTool, aStatName)
    {
        let scalingMap = this.getScalingMapByID(aTool.scalingMapID);
        return (scalingMap != null && scalingMap["magic"][aStatName]);
    }

    isToolRequiredStatMet(aTool, aStatName)
    {
        for (let statIndex = 0; statIndex < this.configuration.stats.length; statIndex++)
        {
            if (this.configuration.stats[statIndex].name == aStatName)
            {
                return this.configuration.stats[statIndex].value >= aTool.requirements[aStatName];
            }
        }

        return false;
    }

    calculateToolScalingForStat(aTool, aStatName, aStatValue, aWeaponLevel)
    {
        let statIndex = aStatValue - 1;
        let scalingMap = this.getScalingMapByID(aTool.scalingMapID);
        if (scalingMap != null && scalingMap["magic"][aStatName])
        {
            let calcCorrect = scalingPaths[aTool.scalingPath][statIndex];
            let statScaling = aTool.scalingEntries[aWeaponLevel][aStatName]

            if (statScaling == 0)
                return 0;
            else
                return statScaling * calcCorrect;
        }
        else
        {
            return 0;
        }
    }

    buildDisplayObject(aName, aScaling, aRequirementMet, aAdjustedScaling, aSchoolBuff)
    {
        return {
            name: aName,
            scaling: aScaling,
            adjustedScaling: aAdjustedScaling,
            schoolBuff: aSchoolBuff,
            requirementMet: aRequirementMet
        }
    }

    // Ascending
    sortByName(a, b)
    {
        return a.name < b.name ? -1 : 1;
    }

    // Descending
    sortByAdjustedSpellBuff(a, b)
    {
        return b.adjustedScaling - a.adjustedScaling;
    }

    // Descending
    sortBySpellBuff(a, b)
    {
        return b.scaling - a.scaling;
    }

    processSpellToolData(aToolData, aOutputList)
    {
        for (var toolIndex = 0; toolIndex < aToolData.length; toolIndex++)
        {
            let curToolScaling = 100;
            let requirementMet = true;
            for (let curStatIndex = 0; curStatIndex < this.configuration.stats.length; curStatIndex++)
            {
                let curWeaponLevel = aToolData[toolIndex].maxLevel == 25 ? this.configuration.weaponLevels.regular : this.configuration.weaponLevels.somber;
                curWeaponLevel = Math.min(curWeaponLevel, aToolData[toolIndex].maxLevel);   // Mostly to cover Meteorite
                if (this.isToolScaledByStat(aToolData[toolIndex], this.configuration.stats[curStatIndex].name) && !this.isToolRequiredStatMet(aToolData[toolIndex], this.configuration.stats[curStatIndex].name))
                {
                    curToolScaling = 60;
                    requirementMet = false;
                    break;
                }
                else
                {
                    curToolScaling += this.calculateToolScalingForStat(aToolData[toolIndex], this.configuration.stats[curStatIndex].name, this.configuration.stats[curStatIndex].value, curWeaponLevel)
                }
            }

            let schoolBuff = false;
            let adjustedScaling = curToolScaling;

            if (requirementMet)
            {
                for (let schoolIndex = 0; schoolIndex < this.spellSchools.length; schoolIndex++)
                {
                    let curSchool = this.spellSchools[schoolIndex];
                    if (curSchool.activeCount >= 1 && aToolData[toolIndex].schoolName == curSchool.name)
                    {
                        for (let i = 0; i < curSchool.activeCount; i++)
                        {
                            adjustedScaling = adjustedScaling * aToolData[toolIndex].schoolMultiplier;
                        }

                        schoolBuff = true;
                        break;
                    }
                }
            }

            aOutputList.push(this.buildDisplayObject(aToolData[toolIndex].name, Math.floor(curToolScaling), requirementMet, Math.floor(adjustedScaling), schoolBuff));
        }
    }

    updateSchoolChecks()
    {
        for(let i = 0; i < this.spellSchools.length; i++)
        {
            let curSchool = this.spellSchools[i];
            if (curSchool.activeCount == 2)
            {
                curSchool.control.classList.add("schoolsContainerEntrySelected2");
                curSchool.control.classList.remove("schoolsContainerEntrySelected1");
            }
            else if (curSchool.activeCount == 1)
            {
                curSchool.control.classList.add("schoolsContainerEntrySelected1");
                curSchool.control.classList.remove("schoolsContainerEntrySelected2");
            }
            else
            {
                curSchool.control.classList.remove("schoolsContainerEntrySelected1");
                curSchool.control.classList.remove("schoolsContainerEntrySelected2");
            }

        }
    }

    updateDisplay()
    {
        var displayArmamentList = [];

        if (this.configuration.filter == SPELL_TYPE_ALL || this.configuration.filter == SPELL_TYPE_SORCERY)
            this.processSpellToolData(staves, displayArmamentList);

        if (this.configuration.filter == SPELL_TYPE_ALL || this.configuration.filter == SPELL_TYPE_INCANTATION)
            this.processSpellToolData(seals, displayArmamentList);

        switch(this.configuration.sort)
        {
            case SORT_NAME:
                displayArmamentList.sort(this.sortByName);
                break;

            case SORT_SCALING:
                displayArmamentList.sort(this.sortBySpellBuff);
                break;

            case SORT_SCALING_ADJUSTED:
                displayArmamentList.sort(this.sortByAdjustedSpellBuff);
                break;
        }

        var output = "";

        for (let i = 0; i < displayArmamentList.length; i++)
        {
            let requirementMetString = displayArmamentList[i].requirementMet ? "": ` requirementUnmet`;
            let schoolBuffString = displayArmamentList[i].schoolBuff ? ` schoolBuff`: "";
            output += `<tr><td>${displayArmamentList[i].name}</td><td class="colSpellBuff${requirementMetString}">${displayArmamentList[i].scaling}</td><td class="colAdjustedBuff${requirementMetString}${schoolBuffString}">${displayArmamentList[i].adjustedScaling}</td></tr>`;
        }
        this.contentElement.innerHTML = `<table><thead><tr><td>Name</td><td class="colSpellBuff">Scaling</td><td class="colAdjustedBuff">Adjusted</td></tr></thead>${output}</table>`;

        this.updateSchoolChecks();
    }

    toggleSpellSchool(aEvent)
    {
        let schoolIndex = parseInt(aEvent.target.id.substring(12));
        if (this.spellSchools[schoolIndex].activeCount >= 2)
        {
            this.spellSchools[schoolIndex].activeCount = 0;
        }
        else if (this.spellSchools[schoolIndex].activeCount == 1)
        {
            this.spellSchools[schoolIndex].activeCount = 2;
        }
        else
        {
            this.spellSchools[schoolIndex].activeCount = 1;
        }

        this.updateDisplay();
    }

    statControlInput(aEvent)
    {
        let statIndex = parseInt(aEvent.target.id.substring(11));
        this.configuration.stats[statIndex].value = parseInt(this.statControls[statIndex].value);
        this.updateDisplay();
    }

    upgradeControlInput(aEvent)
    {
        let controlIndex = parseInt(aEvent.target.id.substring(14));
        let controlValue = parseInt(aEvent.target.value);

        if (controlIndex == 0)
        {
            this.configuration.weaponLevels.regular = controlValue;
        }
        else
        {
            this.configuration.weaponLevels.somber = controlValue;
        }
        this.updateDisplay();
    }

    toolFilterChange(aEvent)
    {
        let controlValue = parseInt(aEvent.target.value);
        this.configuration.filter = controlValue;
        this.updateDisplay();
    }

    toolSortChange(aEvent)
    {
        let controlValue = parseInt(aEvent.target.value);
        this.configuration.sort = controlValue;
        this.updateDisplay();
    }

	initialize()
	{
        this.contentElement = document.getElementById("outputDiv");
        this.controlSorting = document.getElementById("controlSorting");
        this.controlSpellType = document.getElementById("controlSpellType");
        for (let i = 0; i < this.spellSchools.length; i++)
        {
            this.spellSchools[i].activeCount = 0;
            this.spellSchools[i].control = document.getElementById("schoolSelect"+i);
            this.spellSchools[i].control.addEventListener("click", this.toggleSpellSchool.bind(this));
        }

        this.statControls = [];
        for (let i = 0; i < this.configuration.stats.length; i++)
        {
            this.statControls[i] = document.getElementById("statControl"+i);
            this.statControls[i].addEventListener("change", this.statControlInput.bind(this));
        }

        document.getElementById("upgradeControl0").addEventListener("change", this.upgradeControlInput.bind(this));
        document.getElementById("upgradeControl1").addEventListener("change", this.upgradeControlInput.bind(this));


        document.getElementById("controlSpellType").addEventListener("change", this.toolFilterChange.bind(this));
        document.getElementById("controlSorting").addEventListener("change", this.toolSortChange.bind(this));

        this.updateDisplay();
    }
}

var toolInstance = new spellToolComparer();