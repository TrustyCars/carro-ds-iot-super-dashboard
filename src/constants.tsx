export const COLORS = {
  PRIMARY: '#ED6237',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  LIGHTGREY: '#EBEBEB',
  GREY: '#999999',
  GREEN: '#8bbe55',
  LIGHTGREEN: '#def6c5',
  RED: '#cf4444',
};

export const COUNTRY_RADIUS = {
  SINGAPORE: {
    LAT: {
      MIN: 1.158071,
      MAX: 1.472323,
    },
    LONG: {
      MIN: 103.603781,
      MAX: 104.089889,
    },
  },
};

export const ENDPOINT_HOME = {
  PRODUCTION: 'https://xkh3ebmhgk.execute-api.ap-southeast-1.amazonaws.com/api',
  STAGING: 'https://xkh3ebmhgk.execute-api.ap-southeast-1.amazonaws.com/staging',
  KEYPRESS_STAGING: 'https://nefvok4p73.execute-api.ap-southeast-1.amazonaws.com/staging',
  SALES_POD_STAGING: 'https://sjkxbzjjee.execute-api.ap-southeast-1.amazonaws.com/staging',
};
export const ENDPOINT_PATHS = {
  LOGIN: '/user/login',
  GET_USERS: '/user/get_users',

  // Carro Everywhere
  LATEST_VOLTAGE_LEVELS: '/devices/latest_voltage_levels',
  COMMAND_HISTORY: '/devices/get_command_history',
  DEVICE_INIT: '/device/init',

  // Fleet Management
  DEVICE_INFO: '/device/info',
  DEVICE_LIST: '/devices/all',
  DEVICE_VOLTAGE: '/device/get_voltage',
  DEVICE_TRIPS: '/device/trip',
  LATEST_POSITIONS: '/devices/positions',

  // Smart Keypress
  GET_USER_DEVICES: '/devices/my_devices',
  GET_PERMISSIONS: '/device/permissions',
  UPDATE_PERMISSIONS: '/device/update_permissions',
  GET_VEHICLES: '/vehicles/all',
  GET_DEVICES: '/devices/all',
  REGISTER_VEHICLES_AND_KEYS: '/register_vehicle_and_keys',

  // Sales Pod
  GET_ACTIONS: '/actions/all',
};

export const PID_MAPPINGS: { [key: string]: string } = {
  PIDS_SUPPORT_01_20: '_0',
  MONITOR_STATUS_SINCE_DTCS_CLEARED:'_1',
  FREEZE_DTC: '_2',
  FUEL_SYSTEM_STATUS: '_3',
  CALCULATED_ENGINE_LOAD: '_4',
  ENGINE_COOLANT_TEMPERATURE: '_5',
  SHORT_TERM_FUEL_TRIM_BANK_1: '_6',
  LONG_TERM_FUEL_TRIM_BANK_1: '_7',
  SHORT_TERM_FUEL_TRIM_BANK_2: '_8',
  LONG_TERM_FUEL_TRIM_BANK_2: '_9',
  FUEL_PRESSURE: '_a',
  INTAKE_MANIFOLD_ABSOLUTE_PRESSURE: '_b',
  ENGINE_RPM: '_c',
  VEHICLE_SPEED: '_d',
  TIMING_ADVANCE: '_e',
  AIR_INTAKE_TEMPERATURE: '_f',
  MAF_AIR_FLOW_RATE: '_10',
  THROTTLE_POSITION: '_11',
  COMMANDED_SECONDARY_AIR_STATUS: '_12',
  OXYGEN_SENSORS_PRESENT_IN_2_BANKS: '_13',
  OXYGEN_SENSOR_1_SHORT_TERM_FUEL_TRIM: '_14',
  OXYGEN_SENSOR_2_SHORT_TERM_FUEL_TRIM: '_15',
  OXYGEN_SENSOR_3_SHORT_TERM_FUEL_TRIM: '_16',
  OXYGEN_SENSOR_4_SHORT_TERM_FUEL_TRIM: '_17',
  OXYGEN_SENSOR_5_SHORT_TERM_FUEL_TRIM: '_18',
  OXYGEN_SENSOR_6_SHORT_TERM_FUEL_TRIM: '_19',
  OXYGEN_SENSOR_7_SHORT_TERM_FUEL_TRIM: '_1a',
  OXYGEN_SENSOR_8_SHORT_TERM_FUEL_TRIM: '_1b',
  OBD_STANDARDS_THIS_VEHICLE_CONFORMS_TO: '_1c',
  OXYGEN_SENSORS_PRESENT_IN_4_BANKS: '_1d',
  AUXILIARY_INPUT_STATUS: '_1e',
  RUN_TIME_SINCE_ENGINE_START: '_1f',

  PIDS_SUPPORT_21_40: '_20',
  DISTANCE_TRAVELED_WITH_MIL_ON: '_21',
  FUEL_RAIL_PRESSURE: '_22',
  FUEL_RAIL_GAUGE_PRESSURE: '_23',
  OXYGEN_SENSOR_1A_FUEL_AIR_EQUIVALENCE_RATIO: '_24',
  OXYGEN_SENSOR_2A_FUEL_AIR_EQUIVALENCE_RATIO: '_25',
  OXYGEN_SENSOR_3A_FUEL_AIR_EQUIVALENCE_RATIO: '_26',
  OXYGEN_SENSOR_4A_FUEL_AIR_EQUIVALENCE_RATIO: '_27',
  OXYGEN_SENSOR_5A_FUEL_AIR_EQUIVALENCE_RATIO: '_28',
  OXYGEN_SENSOR_6A_FUEL_AIR_EQUIVALENCE_RATIO: '_29',
  OXYGEN_SENSOR_7A_FUEL_AIR_EQUIVALENCE_RATIO: '_2a',
  OXYGEN_SENSOR_8A_FUEL_AIR_EQUIVALENCE_RATIO: '_2b',
  COMMANDED_EGR: '_2c',
  EGR_ERROR: '_2d',
  COMMANDED_EVAPORATIVE_PURGE: '_2e',
  FUEL_TANK_LEVEL_INPUT: '_2f',
  WARM_UPS_SINCE_CODES_CLEARED: '_30',
  DISTANCE_TRAVELED_SINCE_CODES_CLEARED: '_31',
  EVAP_SYSTEM_VAPOR_PRESSURE_A: '_32',
  ABSOLULTE_BAROMETRIC_PRESSURE: '_33',
  OXYGEN_SENSOR_1B_FUEL_AIR_EQUIVALENCE_RATIO: '_34',
  OXYGEN_SENSOR_2B_FUEL_AIR_EQUIVALENCE_RATIO: '_35',
  OXYGEN_SENSOR_3B_FUEL_AIR_EQUIVALENCE_RATIO: '_36',
  OXYGEN_SENSOR_4B_FUEL_AIR_EQUIVALENCE_RATIO: '_37',
  OXYGEN_SENSOR_5B_FUEL_AIR_EQUIVALENCE_RATIO: '_38',
  OXYGEN_SENSOR_6B_FUEL_AIR_EQUIVALENCE_RATIO: '_39',
  OXYGEN_SENSOR_7B_FUEL_AIR_EQUIVALENCE_RATIO: '_3a',
  OXYGEN_SENSOR_8B_FUEL_AIR_EQUIVALENCE_RATIO: '_3b',
  CATALYST_TEMPERATURE_BANK_1_SENSOR_1: '_3c',
  CATALYST_TEMPERATURE_BANK_2_SENSOR_1: '_3d',
  CATALYST_TEMPERATURE_BANK_1_SENSOR_2: '_3e',
  CATALYST_TEMPERATURE_BANK_2_SENSOR_2: '_3f',

  PIDS_SUPPORT_41_60: '_40',
  MONITOR_STATUS_THIS_DRIVE_CYCLE: '_41',
  CONTROL_MODULE_VOLTAGE: '_42',
  ABSOLUTE_LOAD_VALUE: '_43',
  FUEL_AIR_COMMANDED_EQUIVALENCE_RATE: '_44',
  RELATIVE_THROTTLE_POSITION: '_45',
  AMBIENT_AIR_TEMPERATURE: '_46',
  ABSOLUTE_THROTTLE_POSITION_B: '_47',
  ABSOLUTE_THROTTLE_POSITION_C: '_48', 
  ABSOLUTE_THROTTLE_POSITION_D: '_49',
  ABSOLUTE_THROTTLE_POSITION_E: '_4a',
  ABSOLUTE_THROTTLE_POSITION_F: '_4b',
  COMMANDED_THROTTLE_ACTUATOR: '_4c',
  TIME_RUN_WITH_MIL_ON: '_4d',
  TIME_SINCE_TROUBLE_CODES_CLEARED: '_4e',
  NO_KNOWN_PID_FOR_x4f: '_4f',
  NO_KNOWN_PID_FOR_x50: '_50',
  FUEL_TYPE: '_51',
  ETHANOL_FUEL_PERCENTAGE: '_52',
  ABSOLUTE_EVAP_SYSTEM_VAPOR_PRESSURE: '_53',
  EVAP_SYSTEM_VAPOR_PRESSURE_B: '_54',
  NO_KNOWN_PID_FOR_x55: '_55',
  NO_KNOWN_PID_FOR_x56: '_56',
  NO_KNOWN_PID_FOR_x57: '_57',
  NO_KNOWN_PID_FOR_x58: '_58',
  FUEL_RAIL_ABSOLUTE_PRESSURE: '_59',
  RELATIVE_ACCELERATOR_PEDAL_POSITTION: '_5a',
  HYBRID_BATTERY_PACK_REMAINING_LIFE: '_5b',
  ENGINE_OIL_TEMPERATURE: '_5c',
  FUEL_INJECTION_TIMING: '_5d',
  ENGINE_FUEL_RATE: '_5e',
  EMISSION_REQUIREMENT_TO_WHICH_VEHICLE_IS_DESIGNED: '_5f',
  
  PIDS_SUPPORT_61_80: '_60',
  DRIVERS_DEMAND_ENGINE_PERCENT_TORQUE: '_61',
  ACTUAL_ENGINE_PERCENT_TORQUE: '_62',
  ENGINE_REFERENCE_TORQUE: '_63',
  ENGINE_PERCENT_TORQUE_DATA: '_64', // Is this PID name correct?
  AUXILIARY_INPUT_OUTPUT_SUPPORTED: '_65',
  MASS_AIR_FLOW_SENSOR: '_66',
  // ENGINE_COOLANT_TEMPERATURE: '_67', This is the second ENGINE_COOLANT_TEMPERATURE?
  INTAKE_AIR_TEMPERATURE_SENSOR: '_68',
  ACTUAL_EGR_COMMANDED_EGR_AND_EGR_ERROR: '_69',
  COMMANDED_DIESEL_INTAKE_AIRFLOW_CONTROL_AND_RELATIVE_INTAKE_AIRFLOW_POSITION: '_6a',
  EXHAUST_GAS_RECIRCULATION_TEMPERATURE: '_6b',
  COMMANDED_DIESEL_INTAKE_ACTUATOR_CONTROL_AND_RELATIVE_THROTTLE_POSITION: '_6c',
  FUEL_PRESSURE_CONTROL_SYSTEM: '_6d',
  INJECTION_PRESSURE_CONTROL_SYSTEM: '_6e',
  TURBOCHARGER_COMPRESSOR_INLET_PRESSURE: '_6f',
  BOOST_PRESSURE_CONTROL: '_70',
  VARIABLE_GEOMETRY_TURBO_VGT_CONTROL: '_71',
  WASTEGATE_CONTROL: '_72',
  EXHAUST_PRESSURE: '_73',
  TURBOCHARGER_RPM: '_74',
  TURBOCHARGER_TEMPERATURE_1: '_75',
  TURBOCHARGER_TEMPERATURE_2: '_76',
  CHARGE_AIR_COOLER_TEMPERATURE_CACT: '_77',
  EXHAUST_GAS_TEMPERATURE_EGT_BANK_1: '_78',
  EXHAUST_GAS_TEMPERATURE_EGT_BANK_2: '_79',
  DIESEL_PARTICULATE_FILTER_DPF_DIFFERENTIAL_PRESSURE: '_7a',
  DIESEL_PARTICULATE_FILTER_DPF: '_7b',
  DIESEL_PARTICULATE_FILTER_DPF_TEMPERATURE: '_7c',
  NOX_NTE_NOT_TO_EXCEED_CONTROL_AREA_STATUS: '_7d',
  PM_NTE_NOT_TO_EXCEED_CONTROL_AREA: '_7e',
  ENGINE_RUN_TIME: '_7f',

  PIDS_SUPPORT_81_A0: '_80',
  ENGINE_RUN_TIME_FOR_AUXILIARY_EMISSIONS_CONTROL_DEVICE_AECD_1: '_81',
  ENGINE_RUN_TIME_FOR_AUXILIARY_EMISSIONS_CONTROL_DEVICE_AECD_2: '_82',
  NOX_SENSOR: '_83',
  MANIFOLD_SURFACE_TEMPERATURE: '_84',
  NOX_REAGENT_SYSTEM: '_85',
  PARTICULATE_MATTER_PM_SNESOR: '_86',
  // INTAKE_MANIFOLD_ABSOLUTE_PRESSURE: '_87', This is the second INTAKE_MANIFOLD_ABSOLUTE_PRESSURE
  SCR_INDUCE_SYSTEM: '_88',
  RUN_TIME_FOR_AECD_11_TO_15: '_89',
  RUN_TIME_FOR_AECD_16_TO_20: '_8a',
  DIESEL_AFTER_TREATMENT: '_8b',
  O2_SENSOR_WIDE_RANGE: '_8c',
  THROTTLE_POSITION_G: '_8d',
  ENGINE_FRICTION_PERCENT_TORQUE: '_8e',
  PM_SENSOR_BANK_1_AND_2: '_8f',
  WWH_OBD_VEHICLE_OBD_SYSTEM_INFORMATION_1: '_90',
  WWH_OBD_VEHICLE_OBD_SYSTEM_INFORMATION_2: '_91',
  FUEL_SYSTEM_CONTROL: '_92',
  WWH_OBD_VEHICLE_OBD_COUNTERS_SUPPORT: '_93',
  NOX_WARNING_AND_INDUCEMENT_SYSTEM: '_94',
  NO_KNOWN_PID_FOR_X95: '_95',
  NO_KNOWN_PID_FOR_X96: '_96',
  NO_KNOWN_PID_FOR_X97: '_97',
  EXHAUST_GAS_TEMEPRATURE_SENSOR_1: '_98',
  EXHAUST_GAS_TEMEPRATURE_SENSOR_2: '_99',
  HYBRID_OR_EV_VEHICLE_SYSTEM_DATA_BATTERY_VOLTAGE: '_9a',
  DIESEL_EXHAUST_FLUID_SENSOR_DATA: '_9b',
  O2_SENSOR_DATA: '_9c',
  // ENGINE_FUEL_RATE: '_9d', This is the second ENGINE_FUEL_RATE
  ENGINE_EXHAUSE_FLOW_RATE: '_9e',
  FUEL_SYSTEM_PERCENTAGE_USE: '_9f',
  
  PIDS_SUPPORT_A1_C0: '_a0',
  NOX_SENSOR_CORRECTED_DATA: '_a1',
  CYLINDER_FUEL_RATE: '_a2',
  EVAP_SYSTEM_VAPOR_PRESSURE: '_a3',
  TRANSMISSION_ACTUAL_GEAR: '_a4',
  COMMANDED_DIESEL_EXHAUSE_FLUID_DOSING: '_a5',
  ODOMETER: '_a6',
  NOX_SENSOR_CONCENTRATION_SENSORS_3: '_a7',
  NOX_SENSOR_CORRECTED_CONCENTRATION_SENSORS_3_AND_4: '_a8',
  ABS_DISABLE_SWITCH_STATE: '_a9',
  NO_KNOWN_PID_FOR_XAA: '_aa',
  NO_KNOWN_PID_FOR_XAB: '_ab',
  NO_KNOWN_PID_FOR_XAC: '_ac', 
  NO_KNOWN_PID_FOR_XAD: '_ad', 
  NO_KNOWN_PID_FOR_XAE: '_ae', 
  NO_KNOWN_PID_FOR_XAF: '_af', 
  NO_KNOWN_PID_FOR_XB0: '_b0', 
  NO_KNOWN_PID_FOR_XB1: '_b1', 
  NO_KNOWN_PID_FOR_XB2: '_b2', 
  NO_KNOWN_PID_FOR_XB3: '_b3', 
  NO_KNOWN_PID_FOR_XB4: '_b4', 
  NO_KNOWN_PID_FOR_XB5: '_b5', 
  NO_KNOWN_PID_FOR_XB6: '_b6', 
  NO_KNOWN_PID_FOR_XB7: '_b7', 
  NO_KNOWN_PID_FOR_XB8: '_b8', 
  NO_KNOWN_PID_FOR_XB9: '_b9', 
  NO_KNOWN_PID_FOR_XBA: '_ba', 
  NO_KNOWN_PID_FOR_XBB: '_bb', 
  NO_KNOWN_PID_FOR_XBC: '_bc', 
  NO_KNOWN_PID_FOR_XBD: '_bd', 
  NO_KNOWN_PID_FOR_XBE: '_be', 
  NO_KNOWN_PID_FOR_XBF: '_bf',
};
