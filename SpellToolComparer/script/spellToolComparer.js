
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
    spellSchoolsInput = [
        // { id: 0, name: "None"},
        { id: 1, name: "Full Moon Sorcery"},
        { id: 2, name: "Carian Sword Sorcery"},
        { id: 3, name: "Glintblade Sorcery"},
        { id: 4, name: "Stonedigger Sorcery"},
        { id: 5, name: "Crystalian Sorcery"},
        { id: 6, name: "Azur Academy Sorcery"},
        { id: 7, name: "Lusat Academy Sorcery"},
        { id: 8, name: "Magma Sorcery"},
        { id: 9, name: "Thorn Sorcery"},
        { id: 10, name: "Death Sorcery"},
        { id: 11, name: "Gravity Sorcery"},
        { id: 12, name: "Night Sorcery"},
        { id: 13, name: "Cold Sorcery"},
        { id: 14, name: "Azur Primeval Sorcery"},
        { id: 15, name: "Lusat Primeval Sorcery"},
        { id: 16, name: "Ymir Sorcery"},
        { id: 20, name: "Blackflame Incantation"},
        { id: 21, name: "Giantsflame Incantation"},
        { id: 22, name: "Dragon Cult Incantation"},
        { id: 23, name: "Bestial Incantation"},
        { id: 24, name: "Golden Order Incantation"},
        { id: 25, name: "Dragon Communion Incantation"},
        { id: 26, name: "Frenzied Flame Incantation"},
        { id: 27, name: "Godslayer Incantation"},
        { id: 28, name: "Aspect of the Crucible Incantation"},
        { id: 31, name: "Bear Incantation"},
        { id: 32, name: "Guardian Spirit Sorcery"},
        { id: 33, name: "Messmer Incantation"},
        { id: 34, name: "Miquella Incantation"},
        { id: 35, name: "Divine Bird Incantation"},
        { id: 36, name: "Inquisitor Sorcery"},
        // { id: 100, name: "Charged Heavy Attack"},
        // { id: 101, name: "Horseback Attack"},
        // { id: 102, name: "Jump Attack"},
        // { id: 103, name: "Guard Counter Attack"},
        // { id: 104, name: "Final Chain Attack"},
        // { id: 105, name: "Ammunition Attack"},
        // { id: 106, name: "Roar Attack"},
        // { id: 107, name: "Breath Attack"},
        // { id: 108, name: "Thrown Pot Item Attack"},
        // { id: 109, name: "Perfume Item Attack"},
        // { id: 110, name: "Charged Spell Attack"},
        // { id: 111, name: "Charged Skill Attack"},
        // { id: 112, name: "Skill Attack"},
        // { id: 113, name: "Ranged Skill Attack"},
        // { id: 114, name: "Vapor Attack"},
        // { id: 116, name: "Shriek of Milos"},
        // { id: 117, name: "Wraith Attack"},
        // { id: 118, name: "Ammunition On-Hit Attack"},
        // { id: 119, name: "Thrown Item Attack"},
        // { id: 120, name: "Two Handed Attack"},
        // { id: 121, name: "Backstep / Rolling Attack"},
        // { id: 122, name: "Dash Attack"},
        // { id: 123, name: "Magma Attack"},
        // { id: 124, name: "Storm Attack"},
        // { id: 125, name: "Divine Beast Frost Stomp Attack"},
        // { id: 127, name: "Stomp / Kick Attack"},
        // { id: 128, name: "Unused Attack"},
        // { id: 129, name: "Dance Attack"},
        // { id: 130, name: "Messmer Skill Attack"},
        // { id: 131, name: "Hefty Thrown Pot Item Attack"},
        // { id: 132, name: "Blood Attack"},
        // { id: 133, name: "Lightning Skill Attack"},
        // { id: 134, name: "Redmane Attack"},
        // { id: 135, name: "Igon's Harpoon Attack"}
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

    isSchoolUsedByTool(aSchoolID)
    {
        for (let i = 0; i < castingTools.length; i++)
        {
            if (castingTools[i].schoolID == aSchoolID)
            {
                return true;
            }
        }
    }

    getSchoolByID(aSchoolID)
    {
        for (var i = 0; i < this.spellSchools.length; i++)
        {
            if (this.spellSchools[i].id == aSchoolID)
            {
                return this.spellSchools[i];
            }
        }
    }

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

    processSpellToolData(aToolData, aOutputList, aSorceryTools, aIncantationTools)
    {
        for (let toolIndex = 0; toolIndex < aToolData.length; toolIndex++)
        {
            let curTool = aToolData[toolIndex];
            if ((aSorceryTools && curTool.canCastSorceries) || (aIncantationTools && curTool.canCastIncantations))
            {
                let curToolScaling = 100;
                let requirementMet = true;
                for (let curStatIndex = 0; curStatIndex < this.configuration.stats.length; curStatIndex++)
                {
                    let curWeaponLevel = curTool.maxLevel == 25 ? this.configuration.weaponLevels.regular : this.configuration.weaponLevels.somber;
                    curWeaponLevel = Math.min(curWeaponLevel, curTool.maxLevel);   // Mostly to cover Meteorite
                    if (this.isToolScaledByStat(curTool, this.configuration.stats[curStatIndex].name) && !this.isToolRequiredStatMet(curTool, this.configuration.stats[curStatIndex].name))
                    {
                        curToolScaling = 60;
                        requirementMet = false;
                        break;
                    }
                    else
                    {
                        curToolScaling += this.calculateToolScalingForStat(curTool, this.configuration.stats[curStatIndex].name, this.configuration.stats[curStatIndex].value, curWeaponLevel)
                    }
                }

                let schoolBuff = false;
                let adjustedScaling = curToolScaling;

                if (requirementMet)
                {
                    for (let schoolIndex = 0; schoolIndex < this.spellSchools.length; schoolIndex++)
                    {
                        let curSchool = this.spellSchools[schoolIndex];
                        if (curSchool.activeCount >= 1 && curTool.schoolID == curSchool.id)
                        {
                            for (let i = 0; i < curSchool.activeCount; i++)
                            {
                                adjustedScaling = adjustedScaling * curTool.schoolMultiplier;
                            }

                            schoolBuff = true;
                            break;
                        }
                    }
                }

                aOutputList.push(this.buildDisplayObject(curTool.name, Math.floor(curToolScaling), requirementMet, Math.floor(adjustedScaling), schoolBuff));
            }
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

        this.processSpellToolData(castingTools, displayArmamentList, (this.configuration.filter == SPELL_TYPE_ALL || this.configuration.filter == SPELL_TYPE_SORCERY), (this.configuration.filter == SPELL_TYPE_ALL || this.configuration.filter == SPELL_TYPE_INCANTATION));

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
            let schoolBuffEstimateString = displayArmamentList[i].schoolBuff ? "~": "";
            output += `<tr><td>${displayArmamentList[i].name}</td><td class="colSpellBuff${requirementMetString}">${displayArmamentList[i].scaling}</td><td class="colAdjustedBuff${requirementMetString}${schoolBuffString}">${schoolBuffEstimateString}${displayArmamentList[i].adjustedScaling}</td></tr>`;
        }
        this.contentElement.innerHTML = `<table><thead><tr><td>Name</td><td class="colSpellBuff">Scaling</td><td class="colAdjustedBuff">Estimated*</td></tr></thead>${output}</table>`;

        this.updateSchoolChecks();
    }

    toggleSpellSchool(aEvent)
    {
        let schoolID = parseInt(aEvent.target.id.substring(12));
        let curSchool = this.getSchoolByID(schoolID);
        if (curSchool.activeCount >= 2)
        {
            curSchool.activeCount = 0;
        }
        else if (curSchool.activeCount == 1)
        {
            curSchool.activeCount = 2;
        }
        else
        {
            curSchool.activeCount = 1;
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
        let schoolListContainer = document.getElementById("schoolsContainer");
        let schoolListOutput = "";

        this.spellSchools = [];

        this.spellSchoolsInput.sort(this.sortByName);
        for (let i = 0; i < this.spellSchoolsInput.length; i++)
        {
            let schoolID = this.spellSchoolsInput[i].id;
            if (this.isSchoolUsedByTool(schoolID))
            {
                schoolListOutput += `<div id="schoolSelect${schoolID}" class="schoolsContainerEntry">${this.spellSchoolsInput[i].name}<span class="schoolCheck1">&#10003;</span><span class="schoolCheck2">x2</span></div>`;
                this.spellSchools.push(this.spellSchoolsInput[i]);
            }
        }


        schoolListContainer.innerHTML = schoolListOutput;

        for (let i = 0; i < this.spellSchools.length; i++)
        {
            let schoolID = this.spellSchools[i].id;
            this.spellSchools[i].activeCount = 0;
            this.spellSchools[i].control = document.getElementById("schoolSelect"+schoolID);
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